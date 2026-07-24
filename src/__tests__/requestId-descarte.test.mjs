/**
 * Test unitario — lógica de requestId + descarte de ThresholdLab.
 *
 * Mockea el worker con respuestas FUERA DE ORDEN y verifica que
 * el fix implementado descarta las respuestas viejas correctamente.
 *
 * No requiere React/DOM/Next — Node.js puro.
 */

let passed = 0;
let failed = 0;

function assert(condition, msg) {
  if (condition) { passed++; console.log(`  ✅ ${msg}`); }
  else { failed++; console.error(`  ❌ ${msg}`); }
}

// ── Helper que recrea EXACTAMENTE la lógica de ThresholdLab ──────
// Usa el mismo patrón de refs que el componente real: requestIdRef,
// previousRequestIdRef, debounce, y el check corregido con latestId.

class SliderHandler {
  constructor() {
    this.requestIdRef = { current: 0 };
    this.previousRequestIdRef = { current: 0 };
    this.acceptedValues = [];
    this.discardLog = [];
    this.debounceTimeoutRef = null;
  }

  /**
   * Simula handleThresholdChange del ThresholdLab.
   * @param {number} threshold - valor del slider
   * @param {number} workerDelay - cuánto tarda el worker en resolver (ms)
   * @param {boolean} debounced - si pasa por debounce o se ejecuta directo
   */
  slide(threshold, workerDelay = 5, debounced = true) {
    // Limpiar timeout anterior (igual que el componente real)
    if (this.debounceTimeoutRef) {
      clearTimeout(this.debounceTimeoutRef);
    }

    // Incrementar requestId (idéntico al componente)
    this.requestIdRef.current += 1;
    const currentRequestId = this.requestIdRef.current;

    const execute = async () => {
      // Simular delay del worker de Pyodide
      await new Promise(r => setTimeout(r, workerDelay));

      // ═══ ESTE ES EL CHECK CORREGIDO ═══
      const latestId = this.requestIdRef.current;
      if (currentRequestId !== latestId) {
        this.discardLog.push({ requestId: currentRequestId, threshold, latestId });
        return; // ← RESPUESTA DESCARTADA
      }
      this.previousRequestIdRef.current = currentRequestId;
      this.acceptedValues.push({ requestId: currentRequestId, threshold });
    };

    if (debounced) {
      this.debounceTimeoutRef = setTimeout(execute, 10); // debounce 10ms
    } else {
      execute();
    }
  }
}

// ══════════════════════════════════════════════════════════════════
// TEST 1: Baseline — slider lento, sin race condition
// ══════════════════════════════════════════════════════════════════
console.log('\n─── Test 1: Slider sin race, respuesta en orden ───');

async function test1() {
  const h = new SliderHandler();

  // Un solo cambio, sin superposición
  h.slide(10, 5, false); // sin debounce, ejecuta directo

  // Esperar a que la promesa se resuelva
  await new Promise(r => setTimeout(r, 20));

  assert(h.acceptedValues.length === 1, `1 respuesta aceptada: ${h.acceptedValues.length}`);
  assert(h.acceptedValues[0]?.threshold === 10, `threshold=10: ${h.acceptedValues[0]?.threshold}`);
  assert(h.discardLog.length === 0, `0 descartes: ${h.discardLog.length}`);
}

// ══════════════════════════════════════════════════════════════════
// TEST 2: Slider rápido — request vieja cancelada por debounce
// ══════════════════════════════════════════════════════════════════
console.log('\n─── Test 2: Slider rápido (request vieja cancelada por debounce) ───');

async function test2() {
  const h = new SliderHandler();

  // Dos cambios rápidos: el timeout del primero se cancela por el debounce
  h.slide(10, 5); // requestId=1, debounce cancela después
  await new Promise(r => setTimeout(r, 5));
  h.slide(20, 5); // requestId=2, este timeout vence primero
  await new Promise(r => setTimeout(r, 5));
  h.slide(30, 5); // requestId=3, este es el último

  // Esperar a que se resuelvan los timeouts/promesas
  await new Promise(r => setTimeout(r, 50));

  assert(h.acceptedValues.length === 1, `1 respuesta aceptada (no 2 ni 3): ${h.acceptedValues.length}`);
  assert(h.acceptedValues[0]?.threshold === 30, `threshold=30 (la última): ${h.acceptedValues[0]?.threshold}`);

  // request 1 y 2 fueron canceladas por debounce (nunca llegaron a ejecutarse)
  // Si alguna llegó a ejecutarse, fue descartada por requestId
  console.log(`  ℹ️  Descartados: ${h.discardLog.length} (0-2 esperado, depende del timing del debounce)`);
}

// ══════════════════════════════════════════════════════════════════
// TEST 3: Respuestas FUERA DE ORDEN — la más vieja llega después
// ══════════════════════════════════════════════════════════════════
console.log('\n─── Test 3: Respuestas FUERA DE ORDEN (stale outranks fresh) ───');

async function test3() {
  const h = new SliderHandler();

  // Enviamos 3 requests SIN debounce (ejecutan directo) pero con
  // delays que hacen que la request 1 (threshold=10) resuelva ÚLTIMA
  h.slide(10, 50, false); // requestId=1, worker tarda 50ms ← LLEGA ÚLTIMA
  h.slide(20, 5, false);  // requestId=2, worker tarda 5ms  ← LLEGA PRIMERO
  h.slide(30, 10, false); // requestId=3, worker tarda 10ms ← LLEGA SEGUNDO

  // request 2 resuelve a los ~5ms: currentRequestId=2, latestId=3 → 2!==3 → DESCARTADO
  // request 3 resuelve a los ~10ms: currentRequestId=3, latestId=3 → 3===3 → ACEPTADO
  // request 1 resuelve a los ~50ms: currentRequestId=1, latestId=3 → 1!==3 → DESCARTADO

  await new Promise(r => setTimeout(r, 100));

  assert(h.discardLog.length >= 2, `Al menos 2 respuestas descartadas: ${h.discardLog.length}`);
  assert(h.acceptedValues.length === 1, `Solo 1 respuesta aceptada: ${h.acceptedValues.length}`);
  assert(h.acceptedValues[0]?.threshold === 30, `La aceptada es threshold=30 (no 10 ni 20): ${h.acceptedValues[0]?.threshold}`);

  // Verificar que request 1 (threshold=10, la que llegó última) fue descartada
  const discarded1 = h.discardLog.find(d => d.threshold === 10);
  assert(discarded1 !== undefined, `Request threshold=10 fue descartada: ${discarded1 ? 'sí' : 'no'}`);

  // Verificar que request 2 (threshold=20) también fue descartada
  const discarded2 = h.discardLog.find(d => d.threshold === 20);
  assert(discarded2 !== undefined, `Request threshold=20 fue descartada: ${discarded2 ? 'sí' : 'no'}`);
}

// ══════════════════════════════════════════════════════════════════
// TEST 4: El caso peor — 5 requests rápidas, solo la última sobrevive
// ══════════════════════════════════════════════════════════════════
console.log('\n─── Test 4: Arrastre rápido 5 veces, solo última sobrevive ───');

async function test4() {
  const h = new SliderHandler();

  // Simula 5 cambios rápidos de slider (como arrastrar de un extremo a otro)
  for (const th of [10, 12, 14, 16, 18]) {
    h.slide(th, 5);
    await new Promise(r => setTimeout(r, 2)); // 2ms entre cada cambio
  }

  await new Promise(r => setTimeout(r, 100));

  // Solo la última (threshold=18) debería aceptarse
  assert(h.acceptedValues.length === 1, `Solo 1 respuesta aceptada: ${h.acceptedValues.length}`);
  assert(h.acceptedValues[0]?.threshold === 18, `threshold=18: ${h.acceptedValues[0]?.threshold}`);
  // Las requests 1-4 fueron canceladas por debounce y/o descartadas por requestId
}

// ══════════════════════════════════════════════════════════════════
// TEST 5: El fix corrige el bug original (comparar contra 0)
// ══════════════════════════════════════════════════════════════════
console.log('\n─── Test 5: Verifica que el fix no descarta la primera respuesta ───');

async function test5() {
  const h = new SliderHandler();

  // Una sola request con respuesta normal
  h.slide(15, 5, false);

  await new Promise(r => setTimeout(r, 20));

  // La primera respuesta NO debe descartarse
  const discardFirst = h.discardLog.find(d => d.requestId === 1);
  assert(discardFirst === undefined, `Request 1 NO descartada (el fix funciona): ${discardFirst ? 'descartada' : 'OK'}`);
  assert(h.acceptedValues.length === 1, `1 respuesta aceptada: ${h.acceptedValues.length}`);
  assert(h.acceptedValues[0]?.threshold === 15, `threshold=15: ${h.acceptedValues[0]?.threshold}`);
}

// ── Runner ───────────────────────────────────────────────────────
async function main() {
  await test1();
  await test2();
  await test3();
  await test4();
  await test5();

  console.log('\n═══════════════════════════════════════════');
  console.log(`Total: ${passed} passed, ${failed} failed`);
  console.log('═══════════════════════════════════════════');
  process.exit(failed > 0 ? 1 : 0);
}

main();
