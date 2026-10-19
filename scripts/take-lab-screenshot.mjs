#!/usr/bin/env node
/**
 * Demo: captura robusta de un lab con y sin maximizar.
 * Uso: node scripts/take-lab-screenshot.mjs [url] [outPath]
 * Requiere: npx playwright instalado y dev server en localhost:3000
 */
import { chromium } from "playwright-core";

const url = process.argv[2] || "http://localhost:3000/laboratorios/python/lesson01_installing_python";
const outNormal = process.argv[3] || "/tmp/lab-normal.png";
const outMax = process.argv[4] || "/tmp/lab-max.png";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

// Bench bypass (si BENCH_SECRET está seteado) — solo same-origin para no taintear cdn/clerk
const benchSecret = process.env.BENCH_SECRET;
const benchUser = process.env.BENCH_USER || "bench_user_001";
if (benchSecret) {
  await page.route("**/*", async (route) => {
    const reqUrl = route.request().url();
    try {
      const u = new URL(reqUrl);
      if (u.origin === "http://localhost:3000" || u.origin === "https://localhost:3000") {
        const headers = { ...route.request().headers(), "x-bench-secret": benchSecret, "x-bench-user-id": benchUser };
        await route.continue({ headers });
      } else await route.continue();
    } catch { await route.continue(); }
  });
  console.log(`[screenshot] bench route enabled for ${benchUser}`);
}

console.log(`[screenshot] goto ${url}`);
await page.goto(url, { waitUntil: "domcontentloaded" });

// Espera fonts + Listo (mismo que src/lib/e2e/playwright-helpers.ts)
try { await page.evaluate(() => document.fonts.ready); } catch {}
for (let i=0;i<20;i++) {
  const t = await page.evaluate(() => document.body.innerText.includes("Listo") ? "Listo" : "unknown");
  if (t==="Listo") break;
  await page.waitForTimeout(500);
}
await page.waitForTimeout(1000);

// Normal
console.log(`[screenshot] capturing normal -> ${outNormal}`);
await page.screenshot({ path: outNormal, fullPage:false, animations:"disabled", timeout:15000 });
console.log(`[screenshot] normal ok`);

// Maximizado (si hay botón Maximizar)
const hasMax = await page.evaluate(()=> !!document.querySelector('button[aria-label="Maximizar"]'));
if (hasMax) {
  await page.evaluate(()=> document.querySelector('button[aria-label="Maximizar"]')?.click());
  await page.waitForTimeout(1200);
  try { await page.evaluate(()=> document.fonts.ready); } catch {}
  console.log(`[screenshot] capturing maximized -> ${outMax}`);
  await page.screenshot({ path: outMax, fullPage:false, animations:"disabled", timeout:15000 });
  console.log(`[screenshot] maximized ok`);
  await page.evaluate(()=> document.querySelector('button[aria-label="Restaurar"]')?.click());
}

await browser.close();
console.log("done");
