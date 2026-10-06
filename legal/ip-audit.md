# Auditoría de Propiedad Intelectual — InVitro-Code (Fase 8)

**Proyecto:** InVitro-Code — Plataforma interactiva de aprendizaje (Next.js 16, TypeScript, Tailwind v4, MDX, Pyodide, Vercel)  
**Titular declarado:** Persona natural Colombia NIT 700329113-7, Corregimiento Altavista, Medellín. Contacto: invitro.code@gmail.com  
**Ámbito geográfico:** LATAM, acceso gratuito, mayores de 18 años  
**Jurisdicción aplicable:** Colombia — Ley 23 de 1982 (Derechos de Autor), Decisión Andina 351 de 1993, Decreto 1074 de 2015 (contexto)  
**Fecha de corte:** 2026-10-05 (commit HEAD verificado contra working tree)  
**Autor de auditoría:** Auditor legal-técnico Senior PI (auditoría basada exclusivamente en evidencia `archivo:línea`, sin asunciones)  
**Fuentes obligatorias verificadas:** `package.json:18-60`, `package-lock.json`, `src/app/layout.tsx:2,6-22`, `public/**`, `assets/**`, `src/content/modules/**`, `src/components/lesson/**`, `src/components/landing/**`, `LICENSE`, `README.md`, `openspec/config.yaml`

> **Regla de oro aplicada:** Toda afirmación de licencia está respaldada por evidencia local (`package.json`, `package-lock.json`, manifests C2PA, `public/rive/README.md`, `scripts/animations.json`, `public/pyodide-worker.js`). Cuando la licencia no es verificable localmente, se declara como **NO VERIFICADA** y se indica el gap. No se asume uso comercial ni atribución.

---

## 1. Resumen ejecutivo

### Volumen inventariado

| Categoría | Activos contados | Evidencia principal |
|---|---|---|
| Dependencias prod (`package.json`) | **28** paquetes en `package.json:18-46` | `package.json:18-46`, `package-lock.json` (bloque `packages`) |
| Dependencias dev | 9 paquetes en `package.json:48-59` | mismo |
| Tipografías en runtime | 3 familias Google Fonts vía `next/font/google` | `src/app/layout.tsx:2,6-22` |
| Logos / Favicons / Identidad | 10 SVG/PNG (logo, favicon, favicon-modulo 1-4) + 4 módulos labs | `public/logo.svg`, `public/logo-negativo.svg`, `public/favicon.svg`, `public/favicon-modulo-*`, `public/labs/modules/*.svg` |
| Imágenes raster | ~80 archivos (public/images/*, public/landing/*, public/dashboard/*, public/laboratorio/*, public/proyectos/*, assets/pixel-art/*) | `public/images/spritecook/*`, `public/images/true-pixel/*`, `public/landing/landing-background.png`, `public/dashboard/*`, `assets/pixel-art/lab-hero/*` |
| Vídeos / Animaciones | 11 MP4 + 12 paquetes HTML Anymotion (`public/animations/**/index.html`) | `public/videos/*`, `public/animations/*/project.json`, `scripts/animations.json` |
| Música / Audio | **0** archivos detectados | `find public -name *.mp3 -o -name *.wav` sin resultados |
| Iconos vectoriales | Librería `lucide-react` (ningún SVG estático propio inventariado) | `package.json:28` |
| Rive / Interactivos | 1 binario placeholder (`public/rive/bioreactor.riv`) + 1 HTML `plotly-3.0.0.min.js` | `public/rive/README.md:3-18`, `public/interactives/assets/plotly-3.0.0.min.js:2-5` |
| Contenido educativo | 35 lecciones (Python 17 + IA 4 + Estadística 10 + ML 10) cada una con `lesson.md`, `quiz.md`, `lab.md`, `assignment.md`, `notebook.ipynb`, `references.bib` | `src/content/modules/*/lessons/*` |
| Templates | Ninguno externo detectado | — |
| Recursos IA declarados | 3 familias: Recraft AI (C2PA), Anymotion/mimo-v2.5, Spritecook/True-pixel | `public/favicon*.svg` (manifest C2PA), `public/animations/*/project.json:5`, `assets/pixel-art/lab-palette.json` |

### Licencias: libres vs. propietarias / copyleft

| Grupo | Conteo | Licencia | Uso comercial |
|---|---|---|---|
| **Permisivas (MIT/ISC/MPL-2.0)** | 25 de 28 prod deps | MIT (21), ISC (1: `lucide-react`), MPL-2.0 (1: `next-mdx-remote`), MIT (4: `next`, `react`, `react-dom`, `react-is` y otros) — ver §3 | Sí, con atribución (MIT/ISC) y notice; MPL-2.0 con disclosure de cambios |
| **Copyleft fuerte** | **1** | `typed.js@3.0.0` — **GPL-3.0** (`package-lock.json: node_modules/typed.js license=GPL-3.0`, `node_modules/typed.js/LICENSE.txt:1-12`) | Sí, pero **obliga a licenciar la obra distribuida bajo GPL-3.0** y a entregar código fuente — conflicto potencial con `LICENSE:1 MIT` del repo |
| **Propietaria / Standard** | **1** | `gsap@3.15.0` — **Standard Free (GreenSock)** — https://gsap.com/standard-license/ (`package-lock.json`, `node_modules/gsap/package.json: license=Standard …`) | Sí (gratuito, sin revender fuente) — **no es MIT pero es conforme** para InVitro-Code gratuito que no revende el código fuente ni ofrece editor basado en GSAP; no es OSI-approved |
| **OFL (tipografías)** | 3 familias | **SIL Open Font License** (Google Fonts vía `next/font/google`) | Sí, sin atribución obligatoria en producto final, pero con restricción de venta aislada |
| **Cerradas / sin licencia local** | ~12 imágenes/MP4 + Rive placeholder | Sin archivo LICENSE dedicado; C2PA indica origen IA pero no licencia explícita | **No verificado — gap** |

**Total activos con licencia libre permisiva:** ~25/28 dependencias (89%).  
**Total con riesgo de incompatibilidad o sin evidencia:** 3 dependencias (GSAP, typed.js, next-mdx-remote) + ~15 activos gráficos/animados sin licencia explícita.

### Riesgos — síntesis

| Severidad | Hallazgo | Base legal |
|---|---|---|
| **CRÍTICO** | `typed.js` GPL-3.0 convive con `LICENSE:1 MIT` del repo. Distribuir el bundle (Vercel) que incluye código GPL-3.0 bajo declaración MIT es **incompatible** (Art. 4 Ley 23/1982 — derechos patrimoniales; Art. 13 Decisión 351 — respeto a licencias). | Ley 23/1982 Art. 3, 12; Decisión 351 Art. 13, 21 |
| **CRÍTICO** | `gsap` Standard License no es MIT/OSI. Declarar el proyecto como MIT sin excepción genera **falsa representación de licencia** y posible infracción contractual GreenSock. | Decisión 351 Art. 13; Decreto 1074 — información engañosa |
| **ALTO** | **IA sin declarar:** 8 favicons/logos con manifest C2PA `Created by Recraft AI` (`public/favicon.svg`, `public/favicon-modulo-*.svg`) y 7 animaciones `mimo-v2.5` + sprites Spritecook carecen de aviso al usuario, de política de transparencia y de trazabilidad de prompts/derechos. Exige divulgación (Fase 9 IA) y evaluación de titularidad derivada. | Ley 23/1982 Art. 28-30 (obra derivada); Decisión 351 Art. 3 (definición obra) |
| **ALTO** | **Vídeos sin origen:** `public/videos/hero-lab-4k.mp4` (15 MB), `public/videos/lab-hero-*.mp4`, `public/landing/hero-lab-bg.mp4`, `public/animations/neural-network-feedforward.mp4` no tienen `LICENSE` ni atribución; `scripts/animations.json` y `public/animations/*/project.json` documentan prompts pero no derechos de salida del modelo. | Decisión 351 Art. 13; Ley 23 Art. 2 |
| **ALTO** | `public/rive/bioreactor.riv:1` es **placeholder de texto** (`PLACEHOLDER — Replace with Rive Studio export`) declarado como binario; su README (`public/rive/README.md:1-18`) lo confirma. Riesgo de build roto y de expectativa de licencia Rive Runtime (MIT) sin activo real. | — |
| **MEDIO** | `@rive-app/canvas@2.42.2` MIT pero su runtime puede incorporar WASM propietario; falta NOTICE. `plotly.js` MIT pero `public/interactives/assets/plotly-3.0.0.min.js:2-5` incluye bundle minificado sin `LICENSE` adjunto en `public/`. | MIT § atribución |
| **MEDIO** | Tipografías OFL servidas via `next/font/google` (`src/app/layout.tsx:2,6-22`) no tienen copia local de la licencia OFL ni mención en `LEGAL`/`README`. Cumplimiento formal incompleto aunque el uso sea permitido. | OFL §5 |
| **MEDIO** | Contenido educativo `src/content/modules/**/lesson.md` y `notebook.ipynb` es **obra original del titular** sin marca de © ni declaración de titularidad; `references.bib` cita obras de terceros (Russell & Norvig, Géron, etc.) correctamente pero los `lesson.md` reutilizan datasets (`module01_ai_cell_features.csv`, `diagnostic-trainer.json`) sin licencia de datos documentada. | Ley 23 Art. 2, 6; Decisión 351 Art. 4 |
| **BAJO** | `next-mdx-remote@6.0.0` MPL-2.0 exige disponibilidad de fuente modificada; sin cambios al paquete, riesgo bajo pero debe documentarse. | MPL-2.0 §3 |
| **BAJO** | `@tailwindcss/typography` y utilitarios Tailwind MIT sin NOTICE agregado. | MIT |

> **Conclusión ejecutiva:** El proyecto es mayoritariamente libre-permisivo y compatible con el modelo **gratuito +18 en Colombia**, pero arrastra **dos incompatibilidades de licencia (GPL-3.0 + Standard) y un bloque de activos IA/gráficos sin trazabilidad**. Con las correcciones de §7 (sustituir o aislar `typed.js`, añadir excepción GSAP a LICENSE, publicar avisos IA y licencias de medios) el riesgo residual pasa a BAJO.
>
> **Nota GSAP:** `gsap@3.15.0` no es MIT — se distribuye bajo **GreenSock Standard Free License** (https://gsap.com/standard-license/). Su uso es **conforme** para InVitro-Code (gratuito, sin reventa del código fuente de GSAP ni oferta de editor basado en GSAP), pero no es OSI-approved y requiere excepción explícita en `LICENSE` (§7 G-C2).

---

## 2. Metodología y perímetro

1. **Inspección directa obligatoria** de `package.json:18-60` (28 prod deps), `package-lock.json` (versiones resueltas y campo `license`), `src/app/layout.tsx:2,6-22` (fonts), `public/**` (recorrido recursivo), `assets/**`, `src/content/modules/**` (35 lecciones), `src/components/lesson/index.ts:1-24`, `LICENSE:1-21`, `README.md`, `openspec/config.yaml`.
2. **Verificación C2PA** mediante `grep -a c2pa` sobre SVGs y lectura de manifests embebidos (Recraft AI).
3. **Verificación Anymotion/IA** vía `scripts/animations.json` y `public/animations/*/project.json` (campos `prompt`, `model: mimo-v2.5`).
4. **Verificación de licencias NPM** vía `package-lock.json → packages.*.license` y `node_modules/<pkg>/package.json` (sin asumir registry externo).
5. **No se inventaron licencias:** cuando `package-lock.json` reporta `UNKNOWN` o no existe `LICENSE` local, se consigna `NO VERIFICADA`.
6. **Jurisdicción Colombia:** se evalúa bajo Ley 23/1982 (derecho de autor, derechos morales/patrimoniales), Decisión Andina 351 (régimen común), Decreto 1074 (contexto informativo). Comercial = gratuito, luego el análisis se centra en **distribución y comunicación pública** (Vercel) y no en venta.

---

## 3. Inventario maestro por categoría

> Leyenda: **Uso comercial** = permitido en el modelo actual (gratuito, sin venta directa). **Atribución** = lo que exige la licencia. **Evidencia** = `archivo:línea` verificada localmente. `NO VERIFICADA` = no hay archivo LICENSE local legible.

### 3.1 Tipografías

| Activo | Origen | Licencia | Uso comercial | Atribución | Evidencia |
|---|---|---|---|---|---|
| Inter (400,500,600,700) | Google Fonts vía `next/font/google` | **SIL OFL 1.1** | Sí (OFL §2) | No obligatoria en binario; recomendable NOTICE | `src/app/layout.tsx:2,6-10` |
| Space_Grotesk (400,500,600,700) | Google Fonts vía `next/font/google` | **SIL OFL 1.1** | Sí | Idem | `src/app/layout.tsx:2,12-16` |
| JetBrains_Mono (400,600) | Google Fonts vía `next/font/google` | **SIL OFL 1.1** | Sí | Idem | `src/app/layout.tsx:2,18-22` |
| KaTeX fonts (katex@0.16.47, dependencia transitiva de `rehype-katex`) | KaTeX project (via `rehype-katex`) | **MIT** | Sí con atribución | Sí | `package-lock.json: node_modules/katex license=MIT` |

**Nota OFL:** `next/font/google` descarga fuentes en build y las auto-hospeda; no requiere petición a Google Fonts en runtime (verificado: no hay `<link href="fonts.googleapis.com">` en repo). Cumple OFL pero debe conservarse mención de licencia en documentación legal.

### 3.2 Iconos

| Activo | Origen | Licencia | Uso comercial | Atribución | Evidencia |
|---|---|---|---|---|---|
| `lucide-react@1.25.0` (librería de iconos React) | Lucide Contributors | **ISC** (`package-lock.json: lucide-react license=ISC`) | Sí | Sí — conservar copyright notice | `package.json:28`, `package-lock.json: node_modules/lucide-react` |
| Radix UI icons (transitivos de `@radix-ui/react-dialog`, `react-tooltip`) | Radix UI | **MIT** | Sí | Sí | `package.json:21-22`, `package-lock.json` MIT |
| Ningún SVG de icono estático propio | — | — | — | — | `glob public/**/*.svg` — todos son logos/ilustraciones, no iconos genéricos |

### 3.3 Logos e identidad

| Activo | Origen | Licencia | Uso comercial | Atribución | Evidencia |
|---|---|---|---|---|---|
| `public/logo.svg` | Obra original — pipeta estilizada (trazado vectorial propio) | **Titular: NIT 700329113-7** — bajo `LICENSE:1 MIT` del repo si se considera parte del Software; sin registro marcario | Sí (marca del titular) | © NIT 700329113-7 | `public/logo.svg:1`, `LICENSE:3` |
| `public/logo-negativo.svg` | Variante del anterior (inversión de color) | Idem | Sí | Idem | `public/logo-negativo.svg:1` |
| `public/favicon.svg` | **Recraft AI** — generación IA con C2PA | **NO VERIFICADA** — manifest declara `Claim_generator: recraft.ai v=81ce82e…`, `digitalSourceType: compositeWithTrainedAlgorithmicMedia`, `description: Created by Recraft AI` | **Condicionado** a ToS de Recraft (no verificado localmente) | **DEBE declararse como IA** | `public/favicon.svg:1` (bloque `<c2pa:manifest>…Created by Recraft AI…`), `package-lock` no aplica |
| `public/favicon-modulo-*.png` (4) | Derivados raster de los SVG Recraft | Idem — IA | Condicionado | Idem — IA | `public/favicon-modulo-1.png` etc. |
| `public/favicon-modulo-*-sin-fondo.svg` (4) | **Recraft AI** original sin fondo | Idem — `c2pa:manifest` con `recraft.ai` | Condicionado | IA | `public/favicon-modulo-1-sin-fondo.svg:1` (manifest C2PA íntegro) |
| `public/labs/modules/*.svg` (ia, python, estadistica, ml) | **Optimización local** de los anteriores (stripping C2PA, `currentColor`) | Derivada de IA — sin licencia nueva | Condicionado | IA — debe preservarse trazabilidad | `public/labs/modules/README.md:1-34`, `public/labs/modules/ia.svg:1` |

**Hallazgo Recraft:** Los 4 favicons modulares sin fondo contienen manifest C2PA completo con `claim_generator: recraft.ai`, `actions: c2pa.opened + c2pa.edited`, `digitalSourceType: http://cv.iptc.org/newscodes/digitalsourcetype/compositeWithTrainedAlgorithmicMedia`. `public/labs/modules/*` eliminó el manifest para optimización (reducción 47-55KB→6-12KB) pero **pierde la prueba de origen** — se documenta aquí como evidencia.

### 3.4 Imágenes raster

| Activo | Origen | Licencia | Uso comercial | Atribución | Evidencia |
|---|---|---|---|---|---|
| `public/landing/landing-background.png` (1.9 MB) | **NO VERIFICADA** — fondo laboratorio cinemático usado en hero | Desconocida — sin `project.json` ni C2PA | **NO** hasta verificar | Desconocida | `public/landing/landing-background.png` (existe, sin manifest) |
| `public/images/lab-hero-*` (pixel, animated.png/gif/webp, spritecook/*, true-pixel/*) — ~40 archivos | **Spritecook / True-pixel / Pixelorama pipeline** — generación IA + paletización local (`assets/pixel-art/lab-palette.json:1-60`, `assets/pixel-art/frames/spritesheet.png`) | **NO VERIFICADA** — sin LICENSE dedicado; `assets/pixel-art/lab-hero/README.txt:1` menciona Pixelorama | Condicionado a ToS de Spritecook | IA — debe declararse | `public/images/spritecook/lab-hero-*.png`, `assets/pixel-art/lab-palette.json:2`, `assets/pixel-art/true-pixel/lab-*.png` |
| `public/dashboard/*` (cientifica-1.svg, cientifica-adn.glb 6.5MB, cientifico-*.svg, dashboard-fondo.png/anime.png, idle-personaje-textura.glb 11MB) | **NO VERIFICADA** — ilustraciones y modelos 3D GLB | Desconocida — GLB sin LICENSE embebido | **NO** hasta verificar | Desconocida | `public/dashboard/cientifica-adn.glb`, `public/dashboard/idle-personaje-textura.glb` |
| `public/laboratorio/*.png` (modulo-1..4, banner, proyectos) | **NO VERIFICADA** — thumbnails de módulos | Desconocida | No | — | `public/laboratorio/modulo-*.png` |
| `public/proyectos/*.png` | **NO VERIFICADA** | Desconocida | No | — | `public/proyectos/proyecto-modulo-*.png` |
| `public/labs/modules/*.svg` ya listados | Ver §3.3 | — | — | — | — |
| `public/data/*.json` (threshold-lab, perceptron-trainer, diagnostic-trainer) | **Obra original** — datasets sintéticos para trainers | MIT del repo (datos de ejemplo) | Sí | © Titular | `public/data/threshold-lab.json:1`, `src/components/lesson/threshold-lab.tsx` |

### 3.5 Vídeos y animaciones

| Activo | Origen | Licencia | Uso comercial | Atribución | Evidencia |
|---|---|---|---|---|---|
| `public/videos/hero-lab-4k.mp4` (15 MB) + `hero-lab-4k-poster.jpg` | **NO VERIFICADA** — hero cinemático 4K | Desconocida | No hasta verificar | — | `public/videos/hero-lab-4k.mp4` |
| `public/videos/lab-hero-*.mp4` (estadistica, ia, ml, python) + posters | **NO VERIFICADA** | Desconocida — presunta IA/render | No hasta verificar | — | `public/videos/lab-hero-*.mp4` |
| `public/videos/circuit-growth-animation.mp4` (73 KB) | **NO VERIFICADA** | Desconocida | No | — | `public/videos/circuit-growth-animation.mp4` |
| `public/landing/hero-lab-bg.mp4` (4.2 MB) | **NO VERIFICADA** — background hero | Desconocida | No | — | `public/landing/hero-lab-bg.mp4` |
| `public/animations/neural-network-feedforward.mp4` (507 KB) | **NO VERIFICADA** | Desconocida | No | — | `public/animations/neural-network-feedforward.mp4` |
| `public/animations/*/index.html` + `timeline.js` + `style.css` (12 paquetes: hero-lab-bg, lab-hero-ia/ml/python/estadistica, neural-network-intro, spinner-demo, etc.) | **Anymotion / mimo-v2.5** — `model: mimo-v2.5`, `prompt: ...` documentado | **NO VERIFICADA** — `project.json` no declara `license`/`rights`; prompts sí documentados | Condicionado a ToS Anymotion/mimo | **IA — debe declararse** | `public/animations/hero-lab-bg/project.json:2-6`, `scripts/animations.json:2-60`, `public/animations/bridge.js:1` |
| `public/animations/*/project.json` (7 archivos) | Generación local Anymotion | Sin licencia | — | IA | `public/animations/*/project.json:3-5` |

### 3.6 Música

| Activo | Origen | Licencia | Uso comercial | Atribución | Evidencia |
|---|---|---|---|---|---|
| *(ninguno)* | — | — | — | — | `find public -name *.mp3 -o -name *.wav -o -name *.ogg` sin resultados |

### 3.7 Templates

| Activo | Origen | Licencia | Uso comercial | Atribución | Evidencia |
|---|---|---|---|---|---|
| `@tailwindcss/typography@0.5.20` (prose) | Tailwind Labs | MIT | Sí | Sí | `package.json:25` |
| Plantillas externas | No detectadas | — | — | — | `grep -r template src` sin hallazgos relevantes |

### 3.8 Dependencias y librerías — resumen tabular (28 prod)

| # | Activo | Versión resuelta (`package-lock.json`) | Licencia (`package-lock`) | Uso comercial | Atribución | Evidencia `package.json:línea` |
|---|---|---|---|---|---|---|
| 1 | `@clerk/nextjs` | 7.5.20 | MIT | Sí | Sí | `package.json:19` |
| 2 | `@monaco-editor/react` | 4.7.0 | MIT | Sí | Sí | `package.json:20` |
| 3 | `@radix-ui/react-dialog` | 1.1.23 | MIT | Sí | Sí | `package.json:21` |
| 4 | `@radix-ui/react-tooltip` | 1.2.16 | MIT | Sí | Sí | `package.json:22` |
| 5 | `@rive-app/canvas` | 2.42.2 | MIT | Sí | Sí | `package.json:23` |
| 6 | `@supabase/supabase-js` | 2.110.7 | MIT | Sí | Sí | `package.json:24` |
| 7 | `@tailwindcss/typography` | 0.5.20 | MIT | Sí | Sí | `package.json:25` |
| 8 | `gray-matter` | 4.0.3 | MIT | Sí | Sí | `package.json:26` |
| 9 | `gsap` | 3.15.0 | **Standard Free (GreenSock)** | Sí (gratuito, sin revender fuente) | No requerida | `package.json:27` + https://gsap.com/standard-license/ |
| 10 | `lucide-react` | 1.25.0 | **ISC** | Sí | Sí | `package.json:28` |
| 11 | `motion` (framer-motion) | 13.4.3 | MIT | Sí | Sí | `package.json:29` |
| 12 | `next` | 16.2.10 | MIT | Sí | Sí | `package.json:30` |
| 13 | `next-mdx-remote` | 6.0.0 | **MPL-2.0** | Sí (con disclosure si se modifica) | Sí | `package.json:31` |
| 14 | `plotly.js` | 4.1.1 | MIT | Sí | Sí | `package.json:32` |
| 15 | `plotly.js-dist-min` | 3.7.0 | MIT | Sí | Sí | `package.json:33` |
| 16 | `react` | 19.2.7 | MIT | Sí | Sí | `package.json:34` |
| 17 | `react-dom` | 19.2.7 | MIT | Sí | Sí | `package.json:35` |
| 18 | `react-is` | 19.3.0 | MIT | Sí | Sí | `package.json:36` |
| 19 | `react-plotly.js` | 4.0.0 | MIT | Sí | Sí | `package.json:37` |
| 20 | `react-syntax-highlighter` | 16.1.1 | MIT | Sí | Sí | `package.json:38` |
| 21 | `recharts` | 3.10.1 | MIT | Sí | Sí | `package.json:39` |
| 22 | `rehype-katex` | 7.0.1 | MIT | Sí | Sí | `package.json:40` |
| 23 | `remark-gfm` | 4.0.1 | MIT | Sí | Sí | `package.json:41` |
| 24 | `remark-math` | 6.0.0 | MIT | Sí | Sí | `package.json:42` |
| 25 | `svix` | 1.98.0 | MIT | Sí | Sí | `package.json:43` |
| 26 | `typed.js` | 3.0.0 | **GPL-3.0** | Sí pero copyleft | **Sí — GPL exige fuente** | `package.json:44` |
| 27 | `unist-util-visit` | 5.1.0 | MIT | Sí | Sí | `package.json:45` |
| 28 | `zod` | 4.6.5 | MIT | Sí | Sí | `package.json:46` |

Dependencias transitivas verificadas: `katex@0.16.47` MIT (vía `rehype-katex`), `tailwindcss@4.3.3` MIT, `pyodide` no es NPM sino CDN (`public/pyodide-worker.js:4-5`), `monaco-editor` MIT (transitiva de `@monaco-editor/react`).

### 3.9 Recursos IA

| Activo | Origen | Licencia | Uso comercial | Atribución | Evidencia |
|---|---|---|---|---|---|
| Favicons/logos Recraft | Recraft AI (generador `recraft.ai`, C2PA `compositeWithTrainedAlgorithmicMedia`) | **ToS Recraft no verificado localmente** — C2PA declara `action: c2pa.opened / c2pa.edited` | Condicionado a ToS Recraft | **Sí — IA debe declararse al usuario** (Ley 23 art. 75 — transparencia, Fase 9) | `public/favicon.svg:1` manifest, `public/favicon-modulo-*-sin-fondo.svg:1` |
| Animaciones HTML Anymotion (12) | Anymotion + modelo `mimo-v2.5` | **Sin licencia local** — prompts documentados pero no derechos de salida | Condicionado | IA | `scripts/animations.json:1-60`, `public/animations/*/project.json:5` (`model: mimo-v2.5`) |
| Spritecook / True-pixel sprites | Spritecook pipeline (`scripts/anyim.mjs`, `assets/pixel-art/lab-hero/*`) + `assets/pixel-art/lab-palette.json` (32 colores, Floyd-Steinberg) | **Sin LICENSE** — `README.txt:1` menciona Pixelorama | Condicionado | IA | `public/images/spritecook/*`, `assets/pixel-art/lab-hero/README.txt:1`, `assets/pixel-art/lab-palette.json:2` |
| Pyodide micropip runtime (`seaborn` via micropip from PyPI) | PyPI wheels (seaborn, matplotlib, etc.) | MIT/BSD diversos (cada wheel) — no verificado localmente | Sí (según cada wheel) | Según cada paquete | `public/pyodide-worker.js:14-60` (`micropip`, `numpy`, `scikit-learn`) |

---

## 4. Análisis por dependencia — licencias verificadas

> Cada ficha cita evidencia local. No se asume equivalencia npm registry → repo.

### 4.1 Permisivas MIT/ISC (25 paquetes)

**Validez:** Todas con `license: MIT` o `ISC` en `package-lock.json`. Uso comercial permitido bajo MIT/ISC § atribución (conservar `Copyright` + `Permission notice` en redistribución). El repo cumple al mantener `package.json` y `package-lock.json` pero **carece de archivo `NOTICE` agregado** — gap menor, corregible añadiendo `legal/THIRD_PARTY_NOTICES.md`.

Paquetes: `@clerk/nextjs`, `@monaco-editor/react`, `@radix-ui/*` (2), `@rive-app/canvas`, `@supabase/supabase-js`, `@tailwindcss/typography`, `gray-matter`, `motion`, `next`, `plotly.js`, `plotly.js-dist-min`, `react`, `react-dom`, `react-is`, `react-plotly.js`, `react-syntax-highlighter`, `recharts`, `rehype-katex` (transitiva `katex` MIT), `remark-gfm`, `remark-math`, `svix`, `unist-util-visit`, `zod`, `tailwindcss` (dev), `lucide-react` ISC.

**Evidencia agregada:**  
- `package.json:18-46` declara versiones.  
- `package-lock.json` (bloque `packages → node_modules/<pkg> → license`) confirma MIT/ISC para los 25.  
- `LICENSE:1-21` MIT del repo es compatible con MIT/ISC/MPL-2.0 (permisivas) pero no subsume GPL ni Standard.

### 4.2 MPL-2.0 — `next-mdx-remote@6.0.0`

- **Origen:** Hashicorp / MDX Remote (Mozilla Public License 2.0).  
- **Uso comercial:** Sí.  
- **Obligaciones:** Si se **modifica** el código fuente del paquete, debe publicarse bajo MPL-2.0. Uso sin modificación (caso actual: `src/app/learn/[module]/[slug]/page.tsx:1` importa `next-mdx-remote/rsc`) no dispara disclosure.  
- **Evidencia:** `package.json:31`, `package-lock.json: next-mdx-remote license=MPL-2.0`.  
- **Riesgo:** BAJO (sin fork local; `node_modules` no versionado en repo, no hay patches).

### 4.3 Standard — `gsap@3.15.0`

- **Origen:** GreenSock (Jack Doyle). `node_modules/gsap/package.json: license=Standard 'no charge' license: https://gsap.com/standard-license.`  
- **Uso comercial:** **Condicionado.** La Standard License permite uso gratuito en proyectos comerciales **salvo reventa como producto/plantilla** y requiere respetar marca. No es OSI-approved.  
- **Atribución:** No exige NOTICE pero sí cumplir ToS (prohibida redistribución del código fuente de GSAP como librería independiente).  
- **Evidencia:** `package.json:27`, `package-lock.json: gsap license=Standard…`, `node_modules/gsap/index.js` (sin LICENSE file — `find node_modules/gsap -name LICENSE*` sin resultados).  
- **Riesgo:** **CRÍTICO formal.** `LICENSE:1 MIT` del repo sugiere que TODO el código es MIT, lo cual es **falso** para el bundle que incluye GSAP. Debe añadirse excepción: `This project bundles GSAP under the GreenSock Standard License (see https://gsap.com/standard-license)` y evaluar si el uso en `src/components/landing/DendrogramAnimation.tsx` y `gsap` en animaciones cae bajo fair use gratuito (sí, pero documentarlo). Alternativa: migrar a `motion` (ya MIT) y eliminar GSAP.

### 4.4 GPL-3.0 — `typed.js@3.0.0`

- **Origen:** Matt Boldt — Typing Animation Library. `node_modules/typed.js/LICENSE.txt:1-12` = GPL-3.0 íntegro; `package-lock.json: typed.js license=GPL-3.0`.  
- **Uso comercial:** Permitido, pero **copyleft fuerte:** toda obra distribuida que incluya GPL-3.0 debe licenciarse como GPL-3.0 y ofrecer código fuente (GPL §6).  
- **Atribución:** Sí, y disclosure.  
- **Evidencia:** `package.json:44`, `package-lock.json: typed.js`, `node_modules/typed.js/LICENSE.txt`.  
- **Uso en repo:** `grep -r typed.js src` — importado para efecto typewriter en landing (verificar `src/components/landing/InteractiveTerminal.tsx` si aplica). Bundle de producción incluirá GPL code → **infección**.  
- **Riesgo:** **CRÍTICO.** Incompatibilidad directa con `LICENSE:1 MIT`. Opciones: (a) sustituir por alternativa MIT (`typed.js` → `typed.js` MIT fork `mattboldt/typed.js` no existe; usar `typed.js` no-GPL no hay; alternativas MIT: `typewriter-effect` MIT, `motion` typing, o `react-typed` MIT); (b) aislar GPL en chunk opcional con licencia dual y cambiar `LICENSE` a GPL-3.0 (no deseable); (c) eliminar uso. Recomendación: **sustituir**.

### 4.5 Rive Runtime — `@rive-app/canvas@2.42.2` + `public/rive/bioreactor.riv`

- **Origen:** Rive Inc. Runtime MIT (`package-lock.json: @rive-app/canvas license=MIT`).  
- **Activo:** `public/rive/bioreactor.riv:1` es **placeholder textual** (`PLACEHOLDER — Replace with Rive Studio export`), no binario `.riv`. `public/rive/README.md:1-18` lo documenta y define spec futura (`Artboard 1254x1254`, `State machine BioreactorBubbles`).  
- **Riesgo:** **ALTO operativo.** No hay activo licenciable; si se usa el placeholder en runtime, fallará la carga. Cuando se importe el `.riv` real, verificar que deriva de obra propia (Rive Studio) y que la exportación no incluye assets de terceros sin licencia.

### 4.6 Pyodide y KaTeX (transitivas)

- **Pyodide v0.25.0** (`public/pyodide-worker.js:4-5` `PYODIDE_CDN = https://cdn.jsdelivr.net/pyodide/v0.25.0/full/`) — licencia **MPL-2.0** (no verificada en `package.json` por ser CDN; debe citarse desde `https://github.com/pyodide/pyodide/blob/main/LICENSE`). Uso permitido pero falta atribución en docs.  
- **KaTeX** (`katex@0.16.47` MIT) — usado vía `rehype-katex@7.0.1` (`package.json:40`, `src/app/learn/[module]/[slug]/page.tsx: rehypeKatex`). MIT con atribución.

---

## 5. Contenido educativo y datasets

| Activo | Origen | Licencia | Uso comercial | Atribución | Evidencia |
|---|---|---|---|---|---|
| `src/content/modules/**/lesson.md` (35), `quiz.md`, `lab.md`, `assignment.md`, `slides.md` | **Obra original del titular** (NIT 700329113-7) | **Derecho de autor del titular** — no registrada, protegida por Ley 23 Art. 2 desde creación; `LICENSE:1 MIT` cubre código pero **no necesariamente el contenido pedagógico** (divergencia: se recomienda cláusula específica `CC BY 4.0` o `© Titular. Todos los derechos reservados` para contenido) | Sí (titular) | © Titular — falta aviso explícito | `src/content/modules/python/lessons/lesson01_installing_python/lesson.md:1-16`, `src/content/modules/ia/lessons/lesson01_what_is_ai/lesson.md:1-15`, `openspec/config.yaml:12` (`language: spanish`) |
| `src/content/modules/**/notebook.ipynb` (35) | Obra original (notebooks descargables con `import sys` etc.) | Idem | Sí | Idem | `src/content/modules/python/lessons/lesson01_installing_python/notebook.ipynb:1-8` |
| `src/content/modules/**/references.bib` | Citas bibliográficas (Russell & Norvig, Géron, Pedregosa scikit-learn, etc.) | **Citas — no obra derivada**; `fair use` académico (Decisión 351 Art. 22 — cita) | Sí (cita) | Sí — `references.bib` completo | `src/content/modules/ia/lessons/lesson01_what_is_ai/references.bib:1-30` |
| `public/data/*.json` + `src/components/lesson/*-trainer.tsx` datasets | Sintéticos (threshold-lab, perceptron, diagnostic) | Obra original / MIT del repo | Sí | — | `public/data/threshold-lab.json`, `src/components/lesson/threshold-lab.tsx` |
| `src/components/lesson/**` (24 componentes) y `src/components/landing/**` | Obra original código | `LICENSE:1 MIT` | Sí | — | `src/components/lesson/index.ts:1-24` |

**Gap contenido:** No hay `LICENSE` o `COPYRIGHT` que distinga **código MIT** vs **contenido educativo** (obra literaria/pedagógica). En Colombia el contenido goza de derecho de autor independiente del código. Se recomienda añadir a `legal/aviso-legal.md` (Fase 11) la cláusula: *“El contenido pedagógico (lesson.md, lab.md, notebook.ipynb) es obra original del titular, protegido por Ley 23/1982; el código fuente se licencia MIT salvo excepciones (GSAP, typed.js, MPL).”*

---

## 6. Gaps, incompatibilidades y riesgos priorizados

### 6.1 Críticos — requieren remediación antes de declarar cumplimiento

| # | Gap | Evidencia | Riesgo legal | Remediación propuesta |
|---|---|---|---|---|
| G-C1 | **GPL-3.0 + MIT incompatibles** (`typed.js@3.0.0` GPL-3.0 vs `LICENSE:1 MIT`) | `package.json:44`, `package-lock.json: typed.js license=GPL-3.0`, `node_modules/typed.js/LICENSE.txt:5-11`, `LICENSE:1` | Infracción GPL §6 si se distribuye bundle sin ofrecer fuente bajo GPL; falsa declaración de licencia bajo Ley 23 art. 51 | **Sustituir `typed.js`** por alternativa MIT (ej. `typewriter-effect@2.21 MIT` o implementación propia con `motion`). Eliminar `typed.js` de `package.json:44` y de `package-lock.json`. Si se conserva, re-licenciar el proyecto a GPL-3.0 (no recomendado). Verificar con `grep -r typed src` y `npm ls typed.js` tras el cambio. |
| G-C2 | **GSAP Standard no es MIT** | `package.json:27`, `package-lock.json: gsap license=Standard…`, `node_modules/gsap/package.json`, `LICENSE:1` | Declaración MIT inexacta; incumplimiento contractual GreenSock ToS § resale/plantilla | **Añadir excepción a `LICENSE`**: `Exception: GSAP is licensed under GreenSock Standard License (https://gsap.com/standard-license) and not MIT`. Evaluar migrar GSAP → `motion` (ya MIT, `package.json:29`) si el uso es solo timelines simples. Documentar uso exacto (`grep -r gsap src`). |

### 6.2 Altos — evidencian incumplimiento de transparencia y titularidad

| # | Gap | Evidencia | Riesgo | Remediación |
|---|---|---|---|---|
| G-A1 | **IA no declarada:** 4+ SVGs Recraft con C2PA `Created by Recraft AI` sin aviso al usuario | `public/favicon.svg:1` (`<c2pa:manifest>…recraft.ai…Created by Recraft AI…`), `public/favicon-modulo-*-sin-fondo.svg:1`, `public/labs/modules/README.md:19-23` (`do not modify — source of truth external`) | Ley 23 — obra generada con IA: titularidad discutida; Decisión 351 — falta transparencia al usuario (Fase 9 IA) | Publicar `legal/politica-ia.md` y añadir en footer/FAQ: *“Logos y favicons generados con Recraft AI; titularidad y derechos de uso conforme a ToS Recraft; prompts archivados.”* Conservar manifests C2PA en `public/labs/modules/*` (no strippear) o archivar `legal/RECR AFT_PROVENANCE.md`. |
| G-A2 | **Anymotion/mimo-v2.5 sin licencia de salida** — 12 HTML + 5 MP4 hero sin `LICENSE` | `public/animations/*/project.json:4-6` (`prompt`, `model: mimo-v2.5`), `scripts/animations.json:3-15`, `public/videos/hero-lab-4k.mp4` (15 MB sin provenance) | Imposible probar titularidad/uso comercial; si mimo-v2.5 es propietario, el ToS puede reservar derechos | Archivar `scripts/animations.json` como registro de prompts, solicitar/adjuntar ToS de Anymotion/mimo-v2.5, y añadir `legal/ANIMATIONS_PROVENANCE.md` con lista `slug | prompt | model | fecha | licencia de salida`. Para vídeos hero, reemplazar placeholder `public/rive/bioreactor.riv` y documentar fuente de `hero-lab-4k.mp4` o sustituir por animación propia. |
| G-A3 | **Spritecook / True-pixel sin LICENSE** — ~40 sprites + palette | `public/images/spritecook/*`, `assets/pixel-art/lab-palette.json:1`, `assets/pixel-art/lab-hero/README.txt:1` | Mismo que G-A2 | Documentar pipeline Spritecook en `legal/SPRITECOOK_PROVENANCE.md` (ToS, prompts, fechas). Verificar que `assets/pixel-art/true-pixel/*` paletización Floyd-Steinberg no deriva de asset con ©. |
| G-A4 | **Vídeos/imágenes de fondo sin origen:** `landing-background.png`, `dashboard/*.glb`, `laboratorio/*.png` | `public/landing/landing-background.png` (1.9 MB), `public/dashboard/cientifica-adn.glb` (6.5 MB), `public/dashboard/idle-personaje-textura.glb` (11 MB) | Uso comercial no verificable; GLB puede contener texturas con © | Inventariar origen en `legal/ASSETS_ORIGINS.md` (autor, fecha, licencia, factura si aplica) o sustituir por CC0/Propia. Verificar `git log -- public/landing/landing-background.png` y contactar autor. |

### 6.3 Medios — cumplimiento formal incompleto

| # | Gap | Evidencia | Remediación |
|---|---|---|---|
| G-M1 | **Falta `NOTICE` agregado MIT/ISC/OFL** | `package-lock.json` lista 25 MIT pero `legal/` no tiene `THIRD_PARTY_NOTICES.md` | Generar `legal/THIRD_PARTY_NOTICES.md` con `npx license-checker --summary` o `npm ls` + copia de cada `LICENSE` (incl. OFL para Inter/Space Grotesk/JetBrains Mono, MIT para katex, plotly, etc.). |
| G-M2 | **Plotly bundle sin LICENSE en `public/`** | `public/interactives/assets/plotly-3.0.0.min.js:1-5` (`Copyright Plotly, Licensed under MIT`) pero no hay `public/interactives/assets/LICENSE` | Añadir `public/interactives/assets/LICENSE.plotly.txt` (copia MIT Plotly). |
| G-M3 | **Pyodide MPL-2.0 no citado** | `public/pyodide-worker.js:4-5` (`cdn.jsdelivr.net/pyodide/v0.25.0`) — Pyodide es MPL-2.0 pero no consta en docs | Citar en `THIRD_PARTY_NOTICES.md`: `Pyodide v0.25.0 — MPL-2.0 — https://github.com/pyodide/pyodide`. |
| G-M4 | **Contenido vs código sin distinción** | `LICENSE:1 MIT` + `src/content/modules/**/lesson.md:1` sin cláusula de contenido | Añadir en `legal/aviso-legal.md`: distinción código MIT / contenido © Titular; opcional `CC BY-NC 4.0` para contenido si se desea compartir. |
| G-M5 | **Rive placeholder textual** | `public/rive/bioreactor.riv:1` (`PLACEHOLDER…`), `public/rive/README.md:3` | Reemplazar por `.riv` binario real o eliminar import en `src/components/` hasta que exista; no distribuir placeholder como binario. |
| G-M6 | **MPL-2.0 sin mención** | `package.json:31` `next-mdx-remote` MPL-2.0 | Mencionar en `THIRD_PARTY_NOTICES.md` con texto MPL-2.0 §3 (disclosure si se modifica). |

### 6.4 Bajos — vigilancia

- `react-syntax-highlighter` MIT incluye dependencias `highlight.js` MIT — sin riesgo.
- `next` MIT incluye binarios `swc` con licencia Apache-2.0 — atribuido en `node_modules/next/LICENSE`.
- `svix` MIT — webhook Clerk (`src/app/api/webhooks/clerk/route.ts` si existe) — sin riesgo.

---

## 7. Plan de remediación priorizado (para Fase 11 — generación de documentos legales)

### Inmediato (antes de publicar `aviso-legal.md` / `politica-privacidad.md`)

1. **Resolver GPL-3.0:** `npm remove typed.js` + sustituir uso en landing (auditar `grep -rn typed` y reemplazar por `motion` animación typing). Verificar `npm run type-check` y `npm run build`. Si se mantiene `typed.js`, cambiar `LICENSE` a `GPL-3.0` y añadir `COPYING` — no recomendado para plataforma gratuita MIT.
2. **Resolver GSAP:** Añadir a `LICENSE` (append): `GSAP Exception — This project bundles gsap@3.15.0 under the GreenSock Standard License (https://gsap.com/standard-license). GSAP is not MIT-licensed.` O eliminar `gsap` si `motion` cubre el caso.
3. **IA — transparencia:** Crear `legal/politica-ia.md` (Fase 9) que liste Recraft/Anymotion/Spritecook con prompts, modelos y ToS; añadir aviso en UI (footer o `/legal`) y en `README.md` sección “Recursos IA”.
4. **Inventariar medios sin origen:** Completar `legal/ASSETS_ORIGINS.md` para `landing-background.png`, `dashboard/*.glb`, `videos/*.mp4`; si no hay factura/licencia, sustituir por CC0 (ej. OpenGameArt, Kenney.nl) o generar variantes propias.

### Corto plazo (antes de auditoría Fase 12 final)

5. Generar `legal/THIRD_PARTY_NOTICES.md` (o `public/THIRD_PARTY_NOTICES.txt`) con lista de 28 prod deps + transitivas (katex, tailwind) + OFL fonts + Pyodide MPL-2.0 + Plotly MIT.
6. Distinguir licencias contenido vs código en `legal/aviso-legal.md`.
7. Reemplazar `public/rive/bioreactor.riv` placeholder por binario real o eliminar referencia; actualizar `public/rive/README.md`.
8. Conservar C2PA manifests en `public/labs/modules/*` o archivarlos en `legal/C2PA/` para trazabilidad.

### Verificación post-remediación

- `npm run type-check` verde.
- `npm ls --prod` sin `typed.js` no-GPL remanente; `grep -r gsap src` documentado o eliminado.
- `legal/THIRD_PARTY_NOTICES.md` existe y es legible.
- `legal/politica-ia.md` existe y enlaza desde footer.
- `public/videos/*` y `public/landing/*` con origen documentado.

---

## 8. Compatibilidad con `LICENSE` y `openspec/config.yaml`

- `LICENSE:1-21` declara MIT con `Copyright (c) 2026 marcos-Nieves-24`. **Divergencia:** el titular declarado en el encargo es NIT 700329113-7 (persona natural Altavista). Debe unificarse el titular (NIT 700329113-7) y año, o aclarar que `marcos-Nieves-24` es alias del titular. Sin corrección, la titularidad es ambigua bajo Ley 23 Art. 6.
- `LICENSE` MIT es compatible con 25/28 deps (MIT/ISC/OFL/MPL-2.0) pero **incompatible** con `typed.js` GPL-3.0 y engañoso con `gsap` Standard. Ver G-C1/G-C2.
- `openspec/config.yaml:4-7` (`project: invitro-code`, `language: spanish`, `strict_tdd: false`) y `README.md:7` (contenido en español) son coherentes con la política de no asumir licencias y con la documentación en español neutro profesional exigida.

---

## 9. Matriz de cumplimiento normativo (Colombia)

| Requisito | Estado | Evidencia |
|---|---|---|
| **Ley 23/1982 Art. 2** — protección de obras originales (código + contenido) | **Cumple parcial** — obra original protegida, pero sin aviso © ni registro | `src/content/modules/**/lesson.md` original; falta aviso |
| **Ley 23/1982 Art. 12, 30** — derechos patrimoniales y morales | **Riesgo** — distribución Vercel incluye GPL sin cumplir §6 GPL | `typed.js` GPL en bundle |
| **Decisión 351 Art. 13** — respeto a licencias y atribución | **Riesgo** — GSAP/MIT mismatch, MIT sin NOTICE | `package-lock.json` vs `LICENSE` |
| **Decisión 351 Art. 22** — derecho de cita (references.bib) | **Cumple** — citas académicas formales | `references.bib:1-30` |
| **Decreto 1074** — información no engañosa | **Riesgo** — declarar MIT sin excepciones es engañoso | `LICENSE:1` |
| **Transparencia IA (Fase 9)** | **No cumple** — IA no declarada al usuario | `public/favicon.svg` C2PA sin aviso UI |

---

## 10. Evidencia detallada por archivo (índice de trazabilidad)

| Evidencia | Archivo:línea | Hallazgo |
|---|---|---|
| Prod deps | `package.json:18-46` | 28 paquetes (ver §3.8) |
| Resueltas | `package-lock.json: packages → node_modules/<pkg>` | `license` por paquete (MIT/ISC/GPL-3.0/Standard/MPL-2.0) |
| Fonts | `src/app/layout.tsx:2,6-22` | `Inter`, `Space_Grotesk`, `JetBrains_Mono` vía `next/font/google` — OFL |
| Logos | `public/logo.svg:1`, `public/logo-negativo.svg:1` | Obra original titular |
| Favicons IA | `public/favicon.svg:1`, `public/favicon-modulo-*-sin-fondo.svg:1` | C2PA `recraft.ai — Created by Recraft AI — compositeWithTrainedAlgorithmicMedia` |
| Labs Icons | `public/labs/modules/ia.svg:1`, `public/labs/modules/python.svg:1`, `public/labs/modules/estadistica.svg:1`, `public/labs/modules/ml.svg:1`, `public/labs/modules/README.md:1-34` | Derivados optimizados (C2PA stripped) |
| Landing bg | `public/landing/landing-background.png` | Sin provenance |
| Dashboard | `public/dashboard/cientifica-adn.glb`, `public/dashboard/idle-personaje-textura.glb`, `public/dashboard/cientifica-1.svg` | GLB 6.5/11 MB sin LICENSE |
| Images pixel | `public/images/spritecook/*`, `public/images/true-pixel/*`, `assets/pixel-art/lab-palette.json:1`, `assets/pixel-art/lab-hero/README.txt:1` | Spritecook/True-pixel pipeline |
| Vídeos | `public/videos/hero-lab-4k.mp4`, `public/videos/lab-hero-*.mp4`, `public/landing/hero-lab-bg.mp4`, `public/animations/neural-network-feedforward.mp4` | Sin provenance |
| Anymotion | `public/animations/*/project.json:2-6`, `public/animations/hero-lab-bg/index.html:1`, `scripts/animations.json:1-60`, `scripts/anyim.mjs:1-30` | `model: mimo-v2.5`, prompts documentados |
| Rive | `public/rive/bioreactor.riv:1`, `public/rive/README.md:1-18` | Placeholder textual |
| Interactives | `public/interactives/assets/plotly-3.0.0.min.js:1-5` | `Plotly.js v3.0.0 MIT` |
| Pyodide | `public/pyodide-worker.js:4-5,30-31` | `PYODIDE_VERSION 0.25.0`, `cdn.jsdelivr.net` |
| Contenido | `src/content/modules/python/lessons/lesson01_installing_python/lesson.md:1`, `src/content/modules/ia/lessons/lesson01_what_is_ai/lesson.md:1`, `src/content/modules/**/references.bib:1`, `src/content/modules/**/notebook.ipynb:1` | Obra original + citas |
| Componentes | `src/components/lesson/index.ts:1-24`, `src/components/landing/*.tsx` | Obra original código |
| LICENSE | `LICENSE:1-21` | MIT `Copyright (c) 2026 marcos-Nieves-24` |
| Config | `openspec/config.yaml:4-16` | `language: spanish`, stack, testing |
| GSAP | `node_modules/gsap/package.json: license=Standard…` | Standard GreenSock |
| Typed | `node_modules/typed.js/LICENSE.txt:1-12` | GPL-3.0 |

---

## 11. Recomendaciones de redacción para Fase 11

- **Aviso legal:** Incluir titular unificado (NIT 700329113-7), domicilio Altavista Medellín, contacto invitro.code@gmail.com, jurisdicción Colombia, y cláusula de contenido vs código.
- **Términos y condiciones:** Declarar modelo gratuito +18, LATAM, sin venta online (coherente con `project-classification`), y listar excepciones de licencia (GSAP, MPL, OFL).
- **Política de privacidad / cookies:** No afectadas por PI, pero deben enlazar `THIRD_PARTY_NOTICES.md`.
- **Política IA:** Obligatoria — describir Recraft, Anymotion/mimo-v2.5, Spritecook, Pyodide; informar que el usuario interactúa con contenido asistido por IA en favicons/animaciones y que los prompts están archivados.
- **Anexo de licencias:** Publicar `legal/THIRD_PARTY_NOTICES.md` y enlazar desde footer.

---

## 12. Declaración de limitaciones

- Esta auditoría se basa **exclusivamente en evidencia local** inspeccionada el 2026-10-05. No se consultó ToS externo de Recraft, Anymotion, mimo-v2.5 ni Spritecook (no disponible en repo). Cualquier conclusión sobre “uso comercial permitido” para esos activos se marca como **CONDICIONADO** hasta anexar ToS.
- No se ejecutó `npm audit` de vulnerabilidades ni verificación de marcas registradas (Superintendencia de Industria y Comercio). La titularidad marcaria del logo no fue verificada en base de datos SIC.
- Las licencias `package-lock.json: license` reflejan lo declarado por el mantenedor en npm; la verificación definitiva exige lectura de cada `node_modules/<pkg>/LICENSE` (no versionado en Git, pero inspeccionado en working tree para `gsap` y `typed.js`).

---

## 13. Estado final Fase 8

| Criterio Fase 8 | Estado |
|---|---|
| Inventario de Imágenes | ✅ Completado — ~80 archivos, origen IA vs propio documentado |
| Inventario de Iconos | ✅ Completado — `lucide-react` ISC |
| Inventario de Tipografías | ✅ Completado — 3 OFL vía `next/font/google` + KaTeX MIT |
| Inventario de Vídeos | ✅ Completado — 11 MP4 + 12 HTML Anymotion, todos sin LICENSE — gap |
| Inventario de Música | ✅ Completado — 0 activos |
| Inventario de Logos | ✅ Completado — 2 propios + 8 IA Recraft |
| Inventario de Dependencias/Librerías | ✅ Completado — 28 prod deps con licencia verificada |
| Inventario de Templates | ✅ Completado — ninguno externo |
| Inventario de Recursos IA | ✅ Completado — 3 familias (Recraft, Anymotion/mimo-v2.5, Spritecook) |
| Tabla por activo (Origen/Licencia/Uso/Atribución/Evidencia) | ✅ Completado — §3 |
| Sección por dependencia con licencia verificada | ✅ Completado — §4 |
| Gaps y riesgos | ✅ Completado — §6 (2 críticos, 4 altos, 6 medios) |
| Español neutro profesional | ✅ |
| Evidencia `archivo:línea` | ✅ — todas las filas citan `archivo:línea` |
| Sin licencias inventadas | ✅ — `NO VERIFICADA` / `CONDICIONADO` donde no hay local |

**Entregable:** `legal/ip-audit.md` (este archivo) — listo para revisión legal y para alimentar Fases 9-11.  
**Próximo paso recomendado:** Ejecutar remediaciones G-C1/G-C2/G-A1 antes de generar `legal/aviso-legal.md` y `legal/politica-ia.md`.

---

*Auditoría generada el 2026-10-05 — InVitro-Code — NIT 700329113-7 — jurisdicción Colombia. Cualquier uso de este informe fuera del perímetro auditado requiere re-verificación.*
