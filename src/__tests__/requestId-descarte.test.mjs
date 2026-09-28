import { describe, it, expect } from "vitest";

/**
 * Test unitario — lógica de requestId + descarte de ThresholdLab.
 *
 * Mockea el worker con respuestas FUERA DE ORDEN y verifica que
 * el fix implementado descarta las respuestas viejas correctamente.
 *
 * No requiere React/DOM/Next — Node.js puro.
 */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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
    if (this.debounceTimeoutRef) {
      clearTimeout(this.debounceTimeoutRef);
    }

    this.requestIdRef.current += 1;
    const currentRequestId = this.requestIdRef.current;

    const execute = async () => {
      await sleep(workerDelay);

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

describe("ThresholdLab requestId descarte", () => {
  it("slider lento, sin race: 1 respuesta aceptada en orden", async () => {
    const h = new SliderHandler();
    h.slide(10, 5, false); // sin debounce, ejecuta directo
    await sleep(20);

    expect(h.acceptedValues).toHaveLength(1);
    expect(h.acceptedValues[0].threshold).toBe(10);
    expect(h.discardLog).toHaveLength(0);
  });

  it("slider rápido: la request vieja se cancela por debounce, solo sobrevive la última", async () => {
    const h = new SliderHandler();

    h.slide(10, 5); // requestId=1, debounce cancela después
    await sleep(5);
    h.slide(20, 5); // requestId=2, este timeout vence primero
    await sleep(5);
    h.slide(30, 5); // requestId=3, este es el último

    await sleep(50);

    expect(h.acceptedValues).toHaveLength(1);
    expect(h.acceptedValues[0].threshold).toBe(30);
    // Las requests 1 y 2 fueron canceladas por debounce y/o descartadas por requestId.
  });

  it("respuestas FUERA DE ORDEN: la más vieja que llega después se descarta", async () => {
    const h = new SliderHandler();

    h.slide(10, 50, false); // requestId=1, worker tarda 50ms ← LLEGA ÚLTIMA
    h.slide(20, 5, false);  // requestId=2, worker tarda 5ms  ← LLEGA PRIMERO
    h.slide(30, 10, false); // requestId=3, worker tarda 10ms ← LLEGA SEGUNDO

    await sleep(100);

    expect(h.discardLog.length).toBeGreaterThanOrEqual(2);
    expect(h.acceptedValues).toHaveLength(1);
    expect(h.acceptedValues[0].threshold).toBe(30);

    const discarded1 = h.discardLog.find((d) => d.threshold === 10);
    const discarded2 = h.discardLog.find((d) => d.threshold === 20);
    expect(discarded1).toBeDefined();
    expect(discarded2).toBeDefined();
  });

  it("arrastre rápido 5 veces: solo la última sobrevive", async () => {
    const h = new SliderHandler();

    for (const th of [10, 12, 14, 16, 18]) {
      h.slide(th, 5);
      await sleep(2); // 2ms entre cada cambio
    }

    await sleep(100);

    expect(h.acceptedValues).toHaveLength(1);
    expect(h.acceptedValues[0].threshold).toBe(18);
  });

  it("el fix no descarta la primera respuesta", async () => {
    const h = new SliderHandler();

    h.slide(15, 5, false);
    await sleep(20);

    const discardFirst = h.discardLog.find((d) => d.requestId === 1);
    expect(discardFirst).toBeUndefined();
    expect(h.acceptedValues).toHaveLength(1);
    expect(h.acceptedValues[0].threshold).toBe(15);
  });
});