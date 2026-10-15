import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";

const BASE_URL = "http://localhost:3002";
const OUT_DIR = "/home/biohacker24/.gemini/antigravity-cli/brain/4601ed5c-2b44-4e75-ac3f-1e1cb09fd588/verification-screenshots";
const DATA_FILE = "/home/biohacker24/.gemini/antigravity-cli/brain/4601ed5c-2b44-4e75-ac3f-1e1cb09fd588/verification-data.json";

const LESSONS = [
  { id: "lesson01", slug: "lesson01_what_is_ai", title: "¿Qué es la Inteligencia Artificial?" },
  { id: "lesson02", slug: "lesson02_how_ai_learns", title: "¿Cómo aprende la IA?" },
  { id: "lesson03", slug: "lesson03_ai_in_biotech", title: "IA en Biotecnología" },
  { id: "lesson04", slug: "lesson04_real_cases", title: "Casos Reales y Futuro" },
];

async function runVerification() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const auditResults = [];

  for (const lesson of LESSONS) {
    console.log(`\n=== Verifying ${lesson.id}: ${lesson.title} ===`);
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    const errors = [];
    page.on("pageerror", (err) => errors.push(err.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    const url = `${BASE_URL}/preview/lesson/ia/${lesson.slug}`;
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

    let slideInfo = { current: 1, total: 1 };
    try {
      const headerText = await page.textContent("div[role='region'] p");
      const match = headerText?.match(/Diapositiva\s+(\d+)\s+de\s+(\d+)/i);
      if (match) {
        slideInfo = { current: parseInt(match[1]), total: parseInt(match[2]) };
      }
    } catch (e) {
      console.warn("Could not parse header text:", e.message);
    }

    console.log(`Detected ${slideInfo.total} slides`);
    const lessonData = {
      lesson: lesson.id,
      slug: lesson.slug,
      title: lesson.title,
      totalSlides: slideInfo.total,
      slides: [],
      errors: [],
    };

    for (let s = 1; s <= slideInfo.total; s++) {
      await page.waitForTimeout(400);

      const slideScreenshot = path.join(OUT_DIR, `${lesson.id}_slide${s}_desktop.png`);
      await page.screenshot({ path: slideScreenshot });

      // Check overflow & layout
      const layoutMetrics = await page.evaluate(() => {
        const slideArea = document.querySelector("div[role='group'][aria-label='Área de la diapositiva']");
        const hasOverflowY = slideArea ? slideArea.scrollHeight > slideArea.clientHeight : false;
        const hasOverflowX = slideArea ? slideArea.scrollWidth > slideArea.clientWidth : false;
        const tables = document.querySelectorAll("table");
        const trainers = document.querySelectorAll("[data-trainer], .diagnostic-trainer, .perceptron-trainer, .knn-trainer, .regression-trainer, .threshold-lab");
        const buttons = Array.from(document.querySelectorAll("button"));
        const revealBtn = buttons.some(b => b.innerText.includes("Continuar") || b.innerText.includes("Siguiente"));

        const textContent = slideArea ? slideArea.innerText : "";
        const headings = Array.from(document.querySelectorAll("h1, h2, h3, h4")).map(h => h.innerText);

        return {
          hasOverflowY,
          hasOverflowX,
          scrollHeight: slideArea?.scrollHeight,
          clientHeight: slideArea?.clientHeight,
          tableCount: tables.length,
          trainerCount: trainers.length,
          headings,
          textLength: textContent.length,
          revealBtnPresent: revealBtn,
        };
      });

      // Try intra-slide reveal progression
      let revealSteps = 0;
      while (revealSteps < 12) {
        const intraBtn = page.locator("div[role='group'] button:has-text('Continuar'), div[role='group'] button:has-text('Paso'), div[role='group'] button:has-text('Revelar')").first();
        if (await intraBtn.count() > 0 && await intraBtn.isVisible() && await intraBtn.isEnabled()) {
          revealSteps++;
          await intraBtn.click();
          await page.waitForTimeout(300);
          const stepShot = path.join(OUT_DIR, `${lesson.id}_slide${s}_step${revealSteps}.png`);
          await page.screenshot({ path: stepShot });
        } else {
          break;
        }
      }

      lessonData.slides.push({
        slideNumber: s,
        screenshot: slideScreenshot,
        metrics: layoutMetrics,
        revealSteps,
      });

      // Advance to next slide if not last
      if (s < slideInfo.total) {
        const nextSlideBtn = page.locator("button[aria-label='Siguiente diapositiva']");
        if (await nextSlideBtn.count() > 0 && await nextSlideBtn.isVisible() && await nextSlideBtn.isEnabled()) {
          await nextSlideBtn.click();
        } else {
          await page.keyboard.press("ArrowRight");
        }
        await page.waitForTimeout(400);
      }
    }

    // Mobile check
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    const mobileShot = path.join(OUT_DIR, `${lesson.id}_slide1_mobile.png`);
    await page.screenshot({ path: mobileShot });

    lessonData.errors = errors;
    auditResults.push(lessonData);
    await page.close();
  }

  await browser.close();
  fs.writeFileSync(DATA_FILE, JSON.stringify(auditResults, null, 2));
  console.log(`\nVerification finished! Data saved to ${DATA_FILE}`);
}

runVerification().catch((err) => {
  console.error("Verification error:", err);
  process.exit(1);
});
