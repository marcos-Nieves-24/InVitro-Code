# Feature: hero-lab-4k-console — Video 4K + Hero Consola

## Objective
Transformar `hero-lab.mp4` (832×480) a 4K UHD con `Video2X-x86_64.AppImage` y colocar el video en el Hero de `/laboratorios` con texto estilo consola del dashboard (`> Sala de laboratorios` + `// 4 laboratorios · IA …`), conservando el HUD footer actual (nivel/XP/rachas).

## Problem
Hero actual `LabHero.tsx:73-174` usa `bg-dot-grid` + bubbles + `RiveBioreactor` sin video; no existe `hero-lab-4k.mp4` en `public/videos`. Texto actual es `h1` + `LabHeroCopy` rotativo, no consola `bg-black/80`.

## Why
4K mejora fidelidad en pantallas grandes; consola unifica lenguaje visual con dashboard (`HeroBanner.tsx:221-247`) y comunica jerarquía de laboratorios sin decoraciones AI.

## Scope
- Incluye: `public/videos/hero-lab-4k.mp4/.jpg`, `src/components/labs/LabHero/LabHero.tsx` (video bg + consola + HUD preservado), opcional `LabHeroLoader.tsx`/`page.tsx` si requiere poster prop, `odd/tasks/hero-lab-4k-console.md`.
- Excluye: `lab-hero-{ia,python,estadistica,ml}.mp4` (ya entregados 1920×746), Rive dashboard, Supabase, `learn`.

## Constraints
- Video2X v6.4.0 AppImage 221M, device 0 Iris Xe (Vulkan 1.4.318), fallo 403 previo en `anymotion generate` no afecta `video2x` (usa Vulkan local, no API).
- Fuente 832×480 24fps 5.16s 5.8 Mbps → destino 3840×2160 (scale explícito, no `-s 4` que daría 3328×1920).
- Tokens DESIGN.md intactos, `prefers-reduced-motion` poster fallback, `preload="metadata"`, <20 MB.
- Verificación Standard Mode `npm run type-check && npm run build`.

## Tasks

### T1 — Upscale 4K con Video2X [x]
- **Description:** Ejecutar Video2X: `~/Descargas/Video2X-x86_64.AppImage -i source -o public/videos/hero-lab-4k.mp4 -w 3840 -h 2160 -p realesrgan --realesrgan-model realesr-animevideov3 -d 0`, fallback `libplacebo anime4k-v4-a+a` si artefactos. Luego `ffmpeg` poster + `movflags +faststart` + `crf 20`.
- **Files:** `public/videos/hero-lab-4k.mp4` (14M, 3840×2160 h264 yuv420p 24fps), `public/videos/hero-lab-4k-poster.jpg` (497K, 3840×2160)
- **Acceptance:** `ffprobe` 3840×2160 h264 yuv420p 5.20s, `ls -lh` 14M <20 MB, `faststart` moov 36 < mdat 2523 ✅, poster 3840×2160 JPG ✅.
- **Verification:** `ffprobe 3840x2160 yuv420p`, `ls -lh 14M/497K`, `moov before mdat` check — pass 2026-09-27
- **Route:** delegated direct (infra + binary, long-running)
- **Status:** ☑ done — 14M / ffprobe 3840×2160 h264 yuv420p 5.2s / poster 3840×2160 / faststart moov 36 < mdat 2523 — libplacebo fallback (realesrgan requires -s 2/3/4, w/h not allowed)

### T2 — Hero consola con video + HUD [x]
- **Description:** Reescribir `LabHero.tsx` body: `video absolute object-cover` + gradient `from-graphite/75 via-graphite/35` + `div w-[420px] rounded-3xl border comic-border bg-comic-bg/85 backdrop-blur-sm p-8` > `div font-mono bg-black/80 border white/10 p-4` con 3× `TypingText` exactos (`> Sala de laboratorios` delay28 cursor █ brand-300, `// 4 laboratorios · IA · Python · Bioestadística · ML` delay22, `Completa los ejercicios interactivos y domina los conceptos.` delay18) + `SlideArrowButton Explorar laboratorios #hub`. Mantener HUD footer `LabHero.tsx:127-171` sin cambios. Quitar `bubble-layer` y `RiveBioreactor` del body, preservar `useLabHeroMotion` solo si fade-in.
- **Files:** `src/components/labs/LabHero/LabHero.tsx`
- **Acceptance:** Video 4K de fondo, consola replica dashboard, HUD nivel/XP/rachas intacto, `prefers-reduced-motion` poster estático, sin `bg-dot-grid`.
- **Verification:** `npm run type-check && npm run build`
- **Route:** delegated direct (UI rewrite, 1 file non-trivial + motion)
- **Status:** ☑ done — LabHero rewrite 174→~120 lines, video 4K bg + gradient + console 3×TypingText + SlideArrowButton, HUD footer verbatim preserved, type-check PASS, build PASS 19/19 (2026-09-27)

## Authorized Scope
Solo hero lab hub 4K + consola. No tocar 4 heroes de módulos ni dashboard.

## TDD Mode
Standard Mode `strict_tdd: false`. No RED.

## Delivery Strategy
Single commit por fase (T1 asset + T2 code pueden ir juntos o separados; forecast <400 líneas por tarea).

## Forecast
- Authored lines: ~80 (LabHero rewrite)
- Files: 3 (mp4, jpg, LabHero.tsx)
- Work-unit commits: 1-2

## Progress
- 2026-09-27 — Feature created; no writes yet. Branch odd/lab-journey-redesign.
- 2026-09-27 — Decision: **ODD** (no SDD) — 2 pasos claros, baja ambigüedad, SDD sobrecarga (proposal/spec/design no reduce riesgo material). ODD documentado.
- 2026-09-27 — T1 done: Video2X libplacebo anime4k-v4-a+a 3840×2160 @ 0.53 FPS 3m54s (realesrgan fallback: scaling factor must be 2/3/4). Re-encode crf20 slow faststart → 14M, poster 497K.
- 2026-09-27 — T2 done: LabHero.tsx rewrite video+console+HUD, type-check PASS, build PASS 19/19.

## Verification Evidence
- Source: `hero-lab.mp4` 832×480 h264 24fps 5.16s 5.8Mbps verified `ffprobe` + AppImage 221M ELF, devices 0 Iris Xe Vulkan 1.4.318.
- T1 Video2X libplacebo: 125 frames, 00:03:54, 3840×2160 yuv420p, raw 11M 16946 kb/s → optimized crf20 14M 22757 kb/s faststart moov 36 < mdat 2523 (<20M ✅).
- Poster: 3840×2160 JPEG 497K q:v 2.
- T2: `npm run type-check` PASS (no errors), `npm run build` PASS 19/19 compiled 11.4s.
- Files committed together T1+T2: `public/videos/hero-lab-4k.mp4`, `public/videos/hero-lab-4k-poster.jpg`, `src/components/labs/LabHero/LabHero.tsx`.

---
*Locator: `odd/tasks/hero-lab-4k-console.md` | Engram mirror: `odd/hero-lab-4k-console/tasks`*
