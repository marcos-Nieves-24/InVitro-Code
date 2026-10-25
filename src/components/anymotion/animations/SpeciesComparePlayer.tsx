"use client";

import { useEffect, useState } from "react";
import { AnymotionStage } from "../AnymotionStage";

// ---------------------------------------------------------------------------
// Props
//
// Same `rows` / `leftLabel` / `rightLabel` shape that ComparisonTable takes,
// so the lesson table this component replaces moves across verbatim: every
// label, every attribute name and every value string is read back out of the
// props. Nothing scientific is authored here — the component only decides
// HOW a given attribute is drawn, never WHAT it says.
// ---------------------------------------------------------------------------

interface CompareRow {
  feature: string;
  left: string;
  right: string;
}

interface SpeciesComparePlayerProps {
  rows: CompareRow[];
  leftLabel: string;
  rightLabel: string;
  caption?: string;
}

// ---------------------------------------------------------------------------
// Deterministic noise — a seeded generator baked once at module load.
//
// The surface bumps of a conidium must be identical on every render, every
// client and during SSR, so this uses the same fixed-seed technique as
// OverfittingPlayer and never calls Math.random().
// ---------------------------------------------------------------------------

const BLOB_SEGMENTS = 30;

function seededSeries(seed: number, count: number): number[] {
  let s = seed >>> 0;
  const out: number[] = [];
  for (let i = 0; i < count; i++) {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    out.push((((t ^ (t >>> 14)) >>> 0) / 4294967296) * 2 - 1);
  }
  return out;
}

const OUTLINE_NOISE = seededSeries(1013904223, BLOB_SEGMENTS);

// Fixed speckle pattern inside the body (dx, dy in body radii units, plus a
// radius). Positions are module constants, so both specimens share the same
// underlying lattice and only the amplitude changes.
const SPECKLES: { dx: number; dy: number; r: number }[] = (() => {
  const a = seededSeries(77712, 26);
  const b = seededSeries(31337, 26);
  return a.map((n, i) => {
    const angle = (i / 26) * Math.PI * 2 * 3.1;
    const radius = 0.22 + 0.5 * Math.abs(n);
    return {
      dx: radius * Math.cos(angle),
      dy: radius * Math.sin(angle),
      r: 0.018 + 0.028 * Math.abs(b[i]),
    };
  });
})();

// ---------------------------------------------------------------------------
// Geometry — single 16:9 viewBox, no hardcoded pixel widths so the SVG scales
// to whatever AnymotionStage budgets it (219px tall on a 390px phone).
// ---------------------------------------------------------------------------

const VB_W = 880;
const VB_H = 495;

const CARD_Y = 78;
const CARD_H = 346;
const CARD_W = 352;
const LEFT_CARD_X = 44;
const RIGHT_CARD_X = VB_W - CARD_W - LEFT_CARD_X; // 484
const LEFT_CX = LEFT_CARD_X + CARD_W / 2; // 220
const RIGHT_CX = RIGHT_CARD_X + CARD_W / 2; // 660

const C_CY = 228;
const BASE_R = 98;

const LABEL_Y = 380;
const CHIP_Y = 390;
const CHIP_H = 26;

const COLORS = {
  mint: "#45dcc6",
  text: "#ffffff",
  dim: "rgba(255,255,255,0.5)",
  cardStroke: "rgba(255,255,255,0.14)",
  /** Unsaturated body shown while a channel is NOT the selected one. */
  neutralBody: "#8b9aa2",
};

// ---------------------------------------------------------------------------
// Small pure helpers
// ---------------------------------------------------------------------------

/** Lowercase and strip diacritics so "Tamaño" and "tamano" match identically. */
function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

type Channel = "shape" | "texture" | "color" | "size" | "highlight";

/**
 * Which visual channel an attribute drives. Matching is done on the
 * attribute's own wording, so the component works on any comparison table
 * that speaks about form, texture, colour or size — and falls back to a
 * pure highlight (ring + readout, no invented geometry) when it cannot tell.
 */
function channelFor(feature: string): Channel {
  const f = normalize(feature);
  if (/forma|silueta|contorno|redonde|alargad|esferic/.test(f)) return "shape";
  if (/textura|superficie|superficial|rugos|verrugos|\blis|suave/.test(f)) return "texture";
  if (/color|tono|tonalidad|pigment|cromat/.test(f)) return "color";
  if (/tamano|medida|talla|dimension|escala|um\b|um2|um²/.test(f)) return "size";
  return "highlight";
}

/** Round vs elongated, straight from the attribute's own wording. */
function aspectFor(desc: string): number {
  const d = normalize(desc);
  const round = /redonde|esferic|circular|globos/.test(d);
  const elongated = /alargad|elongad|ovalad|fusiforme|prolado|cilindr/.test(d);
  if (round && !elongated) return 1.0;
  if (elongated && !round) return 1.46;
  return 1.23;
}

/** Rough vs smooth surface, straight from the attribute's own wording. */
function roughnessFor(desc: string): number {
  const d = normalize(desc);
  const rough = /rugos|verrugos|aspero|granul|espicul/.test(d);
  const smooth = /\blis/.test(d);
  if (rough && !smooth) return 0.92;
  if (smooth && !rough) return 0.06;
  return 0.49;
}

/** A colour name read out of the attribute's own wording. */
function colorFor(desc: string): string | null {
  const d = normalize(desc);
  if (d.includes("azul") && d.includes("verde")) return "#12a594";
  if (d.includes("azul")) return "#4a90d9";
  if (d.includes("verde")) return "#3aa757";
  if (d.includes("rojo") || d.includes("rojiz")) return "#d9534f";
  if (d.includes("amarill")) return "#d9a521";
  if (d.includes("marron") || d.includes("cafe") || d.includes("pard")) return "#8a5a3b";
  if (d.includes("negro") || d.includes("oscur")) return "#3f4a52";
  if (d.includes("blanc")) return "#c9d3d8";
  if (d.includes("violet") || d.includes("purpur")) return "#8b6fc4";
  return null;
}

/** "~3-6 µm" -> [3, 6]. Returns null when no range can be read. */
function sizeRangeFor(desc: string): [number, number] | null {
  const matches = desc.replace(",", ".").match(/\d+(?:\.\d+)?/g);
  if (!matches || matches.length < 2) return null;
  const a = Number(matches[0]);
  const b = Number(matches[1]);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  return a <= b ? [a, b] : [b, a];
}

/** Resolved look of one specimen along one channel. */
interface SpecimenState {
  /** Horizontal stretch of the body: 1 = circular, >1 = elongated. */
  aspect: number;
  /** Surface irregularity, 0..1. */
  roughness: number;
  /** Body tint. */
  color: string;
  /** Radius multiplier. */
  scale: number;
}

function midpoint(a: number, b: number): number {
  return (a + b) / 2;
}

/**
 * The selected channel is drawn at its per-species value on BOTH specimens at
 * once; every other channel stays at the midpoint between the two species, so
 * the only visible difference is the one the student asked to see.
 */
function resolveState(row: CompareRow, side: 0 | 1, channel: Channel): SpecimenState {
  const desc = side === 0 ? row.left : row.right;
  const other = side === 0 ? row.right : row.left;

  const aspectSelf = aspectFor(desc);
  const aspectOther = aspectFor(other);
  const roughSelf = roughnessFor(desc);
  const roughOther = roughnessFor(other);
  const colorSelf = colorFor(desc) ?? COLORS.neutralBody;
  const colorOther = colorFor(other) ?? COLORS.neutralBody;

  const rangeSelf = sizeRangeFor(desc);
  const rangeOther = sizeRangeFor(other);
  const refMax = Math.max(rangeSelf?.[1] ?? 0, rangeOther?.[1] ?? 0);
  const scaleSelf = rangeSelf ? rangeSelf[1] / refMax : 1;
  const scaleOther = rangeOther ? rangeOther[1] / refMax : 1;

  return {
    aspect: channel === "shape" ? aspectSelf : midpoint(aspectSelf, aspectOther),
    roughness: channel === "texture" ? roughSelf : midpoint(roughSelf, roughOther),
    color: channel === "color" ? colorSelf : COLORS.neutralBody,
    scale: channel === "size" ? scaleSelf : midpoint(scaleSelf, scaleOther),
  };
}

// ---------------------------------------------------------------------------
// Shape construction — closed Catmull-Rom through noisy radial samples.
// ---------------------------------------------------------------------------

function bodyPoints(cx: number, cy: number, r: number, aspect: number, roughness: number): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i < BLOB_SEGMENTS; i++) {
    const angle = (i / BLOB_SEGMENTS) * Math.PI * 2;
    // Anisotropic scale is applied along X only: that is what reads as
    // "rounded" versus "elongated".
    const rr = r * (1 + roughness * 0.2 * OUTLINE_NOISE[i]);
    pts.push([cx + rr * aspect * Math.cos(angle), cy + rr * Math.sin(angle)]);
  }
  return pts;
}

function smoothClosedPath(pts: [number, number][]): string {
  const n = pts.length;
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return `${d} Z`;
}

// ---------------------------------------------------------------------------
// prefers-reduced-motion
// ---------------------------------------------------------------------------

/**
 * Live `prefers-reduced-motion: reduce` flag. When set, the component renders
 * its final state instantly (no inline transition), instead of animating the
 * highlight between channels.
 */
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mql.matches);
    update();
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", update);
      return () => mql.removeEventListener("change", update);
    }
    return undefined;
  }, []);
  return reduced;
}

// ---------------------------------------------------------------------------
// Specimen
// ---------------------------------------------------------------------------

interface SpecimenProps {
  cx: number;
  cy: number;
  baseR: number;
  state: SpecimenState;
  /** Species name, from `leftLabel` / `rightLabel`. */
  label: string;
  /** Value of the selected attribute for this side, from `rows`. */
  value: string | null;
  /** Draw the micrometer caliper (only meaningful for the size channel). */
  showCaliper: boolean;
  reduced: boolean;
}

function Specimen({ cx, cy, baseR, state, label, value, showCaliper, reduced }: SpecimenProps) {
  const r = baseR * state.scale;
  const path = smoothClosedPath(bodyPoints(cx, cy, r, state.aspect, state.roughness));
  const innerPath = smoothClosedPath(bodyPoints(cx, cy, r * 0.74, state.aspect, state.roughness));
  const transition = reduced ? undefined : { transition: "fill 320ms ease, opacity 320ms ease" };

  // Bounding box of the drawn body — the emphasis ring tracks it exactly.
  const ringW = r * state.aspect * 2 + 30;
  const ringH = r * 2 + 30;
  const ringX = cx - ringW / 2;
  const ringY = cy - ringH / 2;

  const chipW = value ? Math.min(value.length * 7 + 26, CARD_W - 40) : 0;

  return (
    <g>
      {/* Body */}
      <path d={path} fill={state.color} fillOpacity={0.2} stroke={state.color} strokeWidth={2.4} style={transition} />
      {/* Wet inner highlight */}
      <path d={innerPath} fill="#ffffff" fillOpacity={0.06} style={transition} />
      {/* Membrane ring */}
      <path
        d={smoothClosedPath(bodyPoints(cx, cy, r * 0.88, state.aspect, state.roughness))}
        fill="none"
        stroke={state.color}
        strokeWidth={1.1}
        strokeOpacity={0.35}
        strokeDasharray="6 6"
        style={transition}
      />
      {/* Surface speckles — amplitude is the roughness of this channel */}
      <g fill={state.color}>
        {SPECKLES.map((s, i) => (
          <circle
            key={`sp-${i}`}
            cx={cx + s.dx * r * state.aspect}
            cy={cy + s.dy * r}
            r={s.r * r}
            fillOpacity={0.18 + state.roughness * 0.72}
          />
        ))}
      </g>

      {/* Emphasis ring: marks the specimen as part of the compared channel */}
      <rect
        x={ringX}
        y={ringY}
        width={ringW}
        height={ringH}
        rx={22}
        fill="none"
        stroke={COLORS.mint}
        strokeWidth={1.4}
        strokeOpacity={0.55}
        strokeDasharray="7 6"
        style={transition}
      />

      {/* Micrometer caliper for the size channel */}
      {showCaliper && (
        <g>
          <line
            x1={cx - r * state.aspect}
            x2={cx + r * state.aspect}
            y1={cy + r + 24}
            y2={cy + r + 24}
            stroke="#f59e0b"
            strokeWidth={1.3}
            strokeOpacity={0.9}
          />
          <path
            d={`M${cx - r * state.aspect} ${cy + r + 24} l0 -7 M${cx + r * state.aspect} ${cy + r + 24} l0 7`}
            stroke="#f59e0b"
            strokeWidth={1.1}
            strokeOpacity={0.8}
          />
        </g>
      )}

      {/* Species label */}
      <text
        x={cx}
        y={LABEL_Y}
        textAnchor="middle"
        fill={COLORS.text}
        fontSize={16}
        fontFamily="sans-serif"
        fontWeight={700}
        opacity={0.95}
      >
        {label}
      </text>

      {/* Value of the selected attribute for this side */}
      {value && (
        <g>
          <rect
            x={cx - chipW / 2}
            y={CHIP_Y}
            width={chipW}
            height={CHIP_H}
            rx={13}
            fill={state.color}
            fillOpacity={0.14}
            stroke={state.color}
            strokeOpacity={0.5}
            strokeWidth={1}
          />
          <text
            x={cx}
            y={CHIP_Y + 17}
            textAnchor="middle"
            fill={COLORS.text}
            fontSize={11.5}
            fontFamily="monospace"
            opacity={0.92}
          >
            {value}
          </text>
        </g>
      )}
    </g>
  );
}

// ---------------------------------------------------------------------------
// Player
// ---------------------------------------------------------------------------

/**
 * Interactive two-specimen comparison.
 *
 * A static table asks the student to hold four adjective pairs in their head
 * at once. Here the two conidia sit side by side and the student picks ONE
 * attribute: only that channel diverges between them, on both specimens, and
 * an HTML readout repeats the exact wording underneath — which is what keeps
 * the text legible when the 16:9 stage scales down to phone widths.
 *
 * Deterministic by construction: every geometric property descends from the
 * props and module constants. No Math.random(), no timeline — the attribute
 * selector is plain interactive state, and the only motion is the CSS
 * transition on the highlight, suppressed under prefers-reduced-motion.
 */
export function SpeciesComparePlayer({
  rows,
  leftLabel,
  rightLabel,
  caption,
}: SpeciesComparePlayerProps) {
  // First attribute is selected by default so the stage is never empty.
  const [feature, setFeature] = useState(() => rows[0]?.feature ?? "");
  const reduced = usePrefersReducedMotion();

  if (rows.length === 0) return null;

  const currentRow = rows.find((r) => r.feature === feature) ?? rows[0];
  const channel = channelFor(currentRow.feature);
  const isSize = channel === "size";

  const leftState = resolveState(currentRow, 0, channel);
  const rightState = resolveState(currentRow, 1, channel);

  const transition = reduced ? undefined : { transition: "fill 320ms ease, opacity 320ms ease" };

  return (
    <figure className="my-5">
      <AnymotionStage title={`Comparación de conidias: ${leftLabel} y ${rightLabel}`}>
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="h-full w-full bg-[#0a0a0a]"
          role="img"
          aria-label={`Comparación visual de conidias: ${leftLabel} frente a ${rightLabel}. Atributo comparado: ${currentRow.feature}.`}
        >
          {/* Titles */}
          <text x={VB_W / 2} y={32} textAnchor="middle" fill="white" fontSize={17} fontFamily="sans-serif" fontWeight={700} fontStyle="italic" opacity={0.92}>
            {leftLabel} vs {rightLabel}
          </text>
          <text x={VB_W / 2} y={54} textAnchor="middle" fill={COLORS.mint} fontSize={11.5} fontFamily="monospace" opacity={0.9}>
            {`atributo comparado: ${currentRow.feature}`}
          </text>

          {/* Cards */}
          <rect
            x={LEFT_CARD_X}
            y={CARD_Y}
            width={CARD_W}
            height={CARD_H}
            rx={18}
            fill="white"
            fillOpacity={0.03}
            stroke={COLORS.cardStroke}
            strokeWidth={1}
          />
          <rect
            x={RIGHT_CARD_X}
            y={CARD_Y}
            width={CARD_W}
            height={CARD_H}
            rx={18}
            fill="white"
            fillOpacity={0.03}
            stroke={COLORS.cardStroke}
            strokeWidth={1}
          />

          {/* Divider between the two specimens */}
          <line
            x1={VB_W / 2}
            y1={CARD_Y + 22}
            x2={VB_W / 2}
            y2={CARD_Y + CARD_H - 22}
            stroke="white"
            strokeWidth={1}
            strokeOpacity={0.16}
            strokeDasharray="4 6"
          />

          <Specimen
            cx={LEFT_CX}
            cy={C_CY}
            baseR={BASE_R}
            state={leftState}
            label={leftLabel}
            value={currentRow.left}
            showCaliper={isSize}
            reduced={reduced}
          />
          <Specimen
            cx={RIGHT_CX}
            cy={C_CY}
            baseR={BASE_R}
            state={rightState}
            label={rightLabel}
            value={currentRow.right}
            showCaliper={isSize}
            reduced={reduced}
          />

          {/* Footnote */}
          <text x={VB_W / 2} y={VB_H - 26} textAnchor="middle" fill={COLORS.dim} fontSize={10} fontFamily="monospace">
            {`la diferencia se resalta solo en "${currentRow.feature}"`}
          </text>
        </svg>
      </AnymotionStage>

      {/* Attribute selector — the interactive state of this player. */}
      <div
        role="group"
        aria-label="Atributo a comparar"
        data-species-selector
        className="mt-2 flex flex-wrap gap-2"
      >
        {rows.map((row) => {
          const active = row.feature === currentRow.feature;
          return (
            <button
              key={row.feature}
              type="button"
              onClick={() => setFeature(row.feature)}
              aria-pressed={active}
              className={`min-h-11 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 motion-reduce:transition-none ${
                active
                  ? "border-mint bg-mint/20 text-mint"
                  : "border-white/20 bg-white/5 text-storm hover:border-mint/60 hover:text-mint"
              }`}
            >
              {row.feature}
            </button>
          );
        })}
      </div>

      {/* HTML readout: attribute name plus both values, so the wording stays
          legible wherever the stage has been scaled down. */}
      <div
        aria-live="polite"
        data-species-readout
        className="mt-2 flex flex-col gap-1 rounded-card border border-white/10 bg-surface-card px-4 py-3 text-storm sm:flex-row sm:items-center sm:gap-4"
      >
        <span className="font-mono text-xs whitespace-nowrap text-storm">{currentRow.feature}</span>
        <span className="text-sm text-storm">
          <span className="font-semibold italic text-mint">{leftLabel}</span> {currentRow.left}
        </span>
        <span className="text-sm text-storm">
          <span className="font-semibold italic text-mint">{rightLabel}</span> {currentRow.right}
        </span>
      </div>

      {caption && <figcaption className="mt-2 text-center font-mono text-xs text-storm">{caption}</figcaption>}
    </figure>
  );
}
