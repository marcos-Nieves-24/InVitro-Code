// Helpers para capturas Playwright robustas en labs (Monaco + Inter + HMR)
// Por qué existe: page.screenshot() espera document.fonts.ready. Con CSP vieja
// (style-src sin cdn.jsdelivr.net) Monaco no cargaba y fonts.ready nunca resolvía -> timeout 5s-30s.
// Además setExtraHTTPHeaders con x-bench-* tainting cross-origin rompe Clerk/cdn con CORS.
// Este helper centraliza el patrón correcto.

export type BenchRouteOptions = {
  secret: string;
  userId: string;
};

/**
 * Instala un route que añade headers de bench SOLO a same-origin (localhost).
 * No uses page.setExtraHTTPHeaders con bench — contamina cdn.jsdelivr.net y clerk.
 */
export async function withBenchRoute(page: any, opts: BenchRouteOptions, fn: () => Promise<void>) {
  const secret = opts.secret;
  const userId = opts.userId;
  await page.route("**/*", async (route: any) => {
    const url = route.request().url();
    try {
      const u = new URL(url);
      if (u.origin === "http://localhost:3000" || u.origin === "https://localhost:3000") {
        const headers = { ...route.request().headers(), "x-bench-secret": secret, "x-bench-user-id": userId };
        await route.continue({ headers });
      } else {
        await route.continue();
      }
    } catch {
      await route.continue();
    }
  });
  try {
    await fn();
  } finally {
    await page.unroute("**/*");
  }
}

/**
 * Espera a que el lab esté listo para capturar: DOM + fonts + Pyodide "Listo".
 * Sin esto screenshot puede colgarse en "waiting for fonts to load".
 */
export async function waitForLabReady(page: any, timeoutMs = 20000) {
  // 1. Espera DOM listo
  await page.waitForLoadState?.("domcontentloaded");

  // 2. Espera fonts (Inter + Monaco) — document.fonts.ready resuelve cuando las @font-face declaradas cargan
  try {
    await page.evaluate(() => document.fonts.ready, null, { timeout: 10000 } as any);
  } catch {
    // fallback: espera 2s max y sigue
    await page.waitForTimeout(2000);
  }

  // 3. Espera Pyodide "Listo" o fallback 10s
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const status: string = await page.evaluate(() =>
      document.body.innerText.includes("Listo")
        ? "Listo"
        : document.body.innerText.includes("Cargando")
          ? "Cargando"
          : "unknown",
    );
    if (status === "Listo") return "Listo";
    await page.waitForTimeout(500);
  }
  return "unknown";
}

/** Captura robusta: desactiva animaciones y sube timeout a 15s */
export async function takeLabScreenshot(page: any, path?: string, opts: { fullPage?: boolean } = {}) {
  // Asegura fonts antes de disparar screenshot (evita el internal wait infinito)
  try {
    await page.evaluate(() => document.fonts.ready);
  } catch {}
  return await page.screenshot({
    path,
    fullPage: opts.fullPage ?? false,
    animations: "disabled",
    timeout: 15000,
  });
}

export async function maximizeAndScreenshot(page: any, path?: string) {
  await page.evaluate(() => (document.querySelector('button[aria-label="Maximizar"]') as any)?.click());
  await page.waitForTimeout(1200);
  const buf = await takeLabScreenshot(page, path);
  await page.evaluate(() => (document.querySelector('button[aria-label="Restaurar"]') as any)?.click());
  await page.waitForTimeout(800);
  return buf;
}
