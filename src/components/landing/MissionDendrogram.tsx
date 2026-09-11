"use client";

import { useEffect, useRef, useState } from "react";
import {
  FlaskConical,
  Users,
  Globe,
  Target,
  Eye,
} from "lucide-react";

/*
  Dendrogram layout — top-down, orthogonal segments.
  Root → Misión (3 pilares) + Visión.

  Compact viewBox (1200×815) so the graph renders large inside the
  max-w-1280 card, with20px fonts and no axis-label overlap.
*/

const SVG_W = 1200;
const SVG_H = 815;

const ROOT_Y = 70;
const BRANCH_Y = 250;
const SUB_Y = 345;
const DOTS_Y = 555;
const CARDS_Y = 580;

const LEAF_POSITIONS = [215, 490, 765];

const ROOT_X = (LEAF_POSITIONS[0] + LEAF_POSITIONS[2]) / 2;
const MISSION_X = (LEAF_POSITIONS[0] + LEAF_POSITIONS[2]) / 2;
const VISION_X = 1040;

interface Seg {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  order: number;
}

const segments: Seg[] = [
  { x1: ROOT_X, y1: ROOT_Y + 32, x2: ROOT_X, y2: BRANCH_Y, order: 0 },
  { x1: MISSION_X, y1: BRANCH_Y, x2: VISION_X, y2: BRANCH_Y, order: 1 },
  {
    x1: MISSION_X,
    y1: BRANCH_Y,
    x2: MISSION_X,
    y2: SUB_Y,
    order: 2,
  },
  {
    x1: LEAF_POSITIONS[0],
    y1: SUB_Y,
    x2: LEAF_POSITIONS[2],
    y2: SUB_Y,
    order: 3,
  },
  {
    x1: LEAF_POSITIONS[0],
    y1: SUB_Y,
    x2: LEAF_POSITIONS[0],
    y2: DOTS_Y,
    order: 4,
  },
  {
    x1: LEAF_POSITIONS[1],
    y1: SUB_Y,
    x2: LEAF_POSITIONS[1],
    y2: DOTS_Y,
    order: 5,
  },
  {
    x1: LEAF_POSITIONS[2],
    y1: SUB_Y,
    x2: LEAF_POSITIONS[2],
    y2: DOTS_Y,
    order: 6,
  },
  {
    x1: VISION_X,
    y1: BRANCH_Y,
    x2: VISION_X,
    y2: DOTS_Y,
    order: 4,
  },
];

function segLen(s: Seg) {
  return Math.abs(s.x2 - s.x1) + Math.abs(s.y2 - s.y1);
}

interface AnimLineProps {
  seg: Seg;
  active: boolean;
  color?: string;
  width?: number;
  dash?: boolean;
}

function AnimLine({
  seg,
  active,
  color = "#00b2b2",
  width = 2.5,
  dash = false,
}: AnimLineProps) {
  const len = segLen(seg);
  const delay = seg.order * 260;
  return (
    <line
      x1={seg.x1}
      y1={seg.y1}
      x2={seg.x2}
      y2={seg.y2}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="square"
      strokeDasharray={dash ? "8 6" : len}
      style={{
        strokeDashoffset: dash ? undefined : active ? 0 : len,
        transition:
          active && !dash
            ? `stroke-dashoffset 0.55s ease-out ${delay}ms`
            : "none",
        opacity: dash ? (active ? 0.35 : 0) : 1,
      }}
    />
  );
}

const HEIGHT_LABELS = [
  { y: ROOT_Y, label: "0.0" },
  { y: BRANCH_Y, label: "0.5" },
  { y: SUB_Y, label: "0.7" },
  { y: DOTS_Y, label: "1.0" },
];

// Axis line with ticks + labels on the left, then rotated title further left.
const AXIS_X = 70;
const AXIS_TITLE_X = 14;

const missionText =
  "Cerrar la distancia entre lo que pide la biotecnologia de ahora y lo que se ensena en el aula.";

const visionText =
  "Volverse la plataforma de referencia en espanol para ensenar ciencia de datos aplicada a las ciencias de la vida en America Latina.";

const pilares = [
  {
    icon: FlaskConical,
    label: "Aprendizaje Activo",
    desc: "Terminales interactivas, labs en vivo y desafios de codigo que consolidan el conocimiento con practica real.",
    x: LEAF_POSITIONS[0],
  },
  {
    icon: Users,
    label: "Comunidad",
    desc: "Conecta con otros estudiantes, comparte logros y aprende en colaboracion con biotecnologos.",
    x: LEAF_POSITIONS[1],
  },
  {
    icon: Globe,
    label: "Accesibilidad",
    desc: "Contenido gratuito, multiplataforma y disenado para todos los niveles de experiencia tecnica.",
    x: LEAF_POSITIONS[2],
  },
];

const CARD_W = 250;
const CARD_H = 215;
const CARD_RX = 14;

function getPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function MissionDendrogram() {
  const [active, setActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (getPrefersReducedMotion()) {
      setActive(true);
      return;
    }

    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timerRef.current = setTimeout(() => setActive(true), 150);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const nodeDelay = (order: number) => order * 260 + 400;

  return (
    <section
      id="mision"
      ref={sectionRef}
      className="bg-surface px-6 py-24"
    >
      <div className="mx-auto max-w-[1280px]">
        {/* Title */}
        <div data-reveal className="reveal mb-14 text-center">
          <p className="eyebrow text-storm">Nuestra Identidad</p>
          <h2 className="mt-3 mb-4 font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
            Mision, Vision y Pilares
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate">
            Un arbol de clustering jerarquico que organiza los valores y objetivos
            de InVitro-Code desde la raiz hasta cada pilar de la plataforma.
          </p>
        </div>

        {/* Desktop SVG dendrogram */}
        <div className="hidden overflow-hidden rounded-2xl border border-surface-raised bg-surface-card p-6 shadow-md lg:block">
          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className="h-auto w-full"
            aria-label="Dendrograma de InVitro-Code"
          >
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Left height axis */}
            <line
              x1={AXIS_X}
              y1={ROOT_Y - 8}
              x2={AXIS_X}
              y2={DOTS_Y}
              stroke="#3A4A5C"
              strokeWidth={1}
            />

            {/* Axis ticks + labels + faint guides */}
            {HEIGHT_LABELS.map((tick) => (
              <g key={tick.label}>
                <line
                  x1={AXIS_X - 6}
                  y1={tick.y}
                  x2={AXIS_X + 6}
                  y2={tick.y}
                  stroke="#3A4A5C"
                  strokeWidth={1}
                />
                <line
                  x1={AXIS_X + 6}
                  y1={tick.y}
                  x2={SVG_W - 20}
                  y2={tick.y}
                  stroke="#3A4A5C"
                  strokeWidth={0.4}
                  strokeDasharray="6 8"
                  opacity={0.35}
                />
                <text
                  x={AXIS_X - 12}
                  y={tick.y + 6}
                  textAnchor="end"
                  fontSize="20"
                  fontFamily="JetBrains Mono, monospace"
                  fill="#3A4A5C"
                >
                  {tick.label}
                </text>
              </g>
            ))}

            {/* Rotated axis title — clear of the tick labels */}
            <text
              x={AXIS_TITLE_X}
              y={(ROOT_Y + DOTS_Y) / 2}
              textAnchor="middle"
              fontSize="18"
              fontFamily="JetBrains Mono, monospace"
              fill="#3A4A5C"
              letterSpacing="0.06em"
              transform={`rotate(-90, ${AXIS_TITLE_X}, ${(ROOT_Y + DOTS_Y) / 2})`}
            >
              DISTANCIA DE ENLACE
            </text>

            {/* All dendrogram segments */}
            {segments.map((seg, i) => (
              <AnimLine key={i} seg={seg} active={active} width={2.5} />
            ))}

            {/* Faint horizontal guides */}
            {[LEAF_POSITIONS[0], LEAF_POSITIONS[1], LEAF_POSITIONS[2]].map(
              (x, i) => (
                <AnimLine
                  key={`guide-${i}`}
                  seg={{
                    x1: x,
                    y1: SUB_Y,
                    x2: x,
                    y2: ROOT_Y,
                    order: 0,
                  }}
                  active={active}
                  color="#5A7A8A"
                  width={0.5}
                  dash
                />
              ),
            )}

            {/* Root node — favicon */}
            <g
              style={{
                opacity: active ? 1 : 0,
                transition: "opacity 0.4s ease-out 0ms",
              }}
            >
              <circle
                cx={ROOT_X}
                cy={ROOT_Y}
                r={32}
                fill="#111439"
                stroke="#00b2b2"
                strokeWidth={2.5}
                filter="url(#glow)"
              />
              <image
                href="/logo.svg"
                x={ROOT_X - 16}
                y={ROOT_Y - 16}
                width={32}
                height={32}
              />
            </g>

            {/* Mision node */}
            <g
              style={{
                opacity: active ? 1 : 0,
                transition: `opacity 0.45s ease-out ${nodeDelay(2)}ms`,
              }}
            >
              <rect
                x={MISSION_X - 62}
                y={BRANCH_Y - 26}
                width={124}
                height={52}
                rx={10}
                fill="#ffffff"
                stroke="#00b2b2"
                strokeWidth={2}
              />
              <text
                x={MISSION_X}
                y={BRANCH_Y + 7}
                textAnchor="middle"
                fontSize="20"
                fontFamily="Space Grotesk, sans-serif"
                fontWeight="600"
                fill="#111439"
              >
                Mision
              </text>
            </g>

            {/* Vision node */}
            <g
              style={{
                opacity: active ? 1 : 0,
                transition: `opacity 0.45s ease-out ${nodeDelay(1)}ms`,
              }}
            >
              <rect
                x={VISION_X - 62}
                y={BRANCH_Y - 26}
                width={124}
                height={52}
                rx={10}
                fill="#ffffff"
                stroke="#00b2b2"
                strokeWidth={2}
              />
              <text
                x={VISION_X}
                y={BRANCH_Y + 7}
                textAnchor="middle"
                fontSize="20"
                fontFamily="Space Grotesk, sans-serif"
                fontWeight="600"
                fill="#111439"
              >
                Vision
              </text>
            </g>

            {/* Group label */}
            <text
              x={(LEAF_POSITIONS[0] + LEAF_POSITIONS[2]) / 2}
              y={DOTS_Y - 38}
              textAnchor="middle"
              fontSize="20"
              fontFamily="Space Grotesk, sans-serif"
              fontWeight="700"
              fill="#111439"
              style={{
                opacity: active ? 1 : 0,
                transition: `opacity 0.4s ease-out ${nodeDelay(4)}ms`,
              }}
            >
              Pilares
            </text>

            {/* Cluster bracket — Mision group */}
            <rect
              x={LEAF_POSITIONS[0] - CARD_W / 2 - 8}
              y={CARDS_Y - 8}
              width={LEAF_POSITIONS[2] - LEAF_POSITIONS[0] + CARD_W + 16}
              height={CARD_H + 16}
              rx={16}
              fill="none"
              stroke="#00b2b2"
              strokeWidth={1.5}
              strokeDasharray="8 6"
              style={{
                opacity: active ? 0.35 : 0,
                transition: `opacity 0.6s ease-out ${nodeDelay(7)}ms`,
              }}
            />

            {/* Cluster bracket — Vision */}
            <rect
              x={VISION_X - CARD_W / 2 - 8}
              y={CARDS_Y - 8}
              width={CARD_W + 16}
              height={CARD_H + 16}
              rx={16}
              fill="none"
              stroke="#5A7A8A"
              strokeWidth={1.5}
              strokeDasharray="8 6"
              style={{
                opacity: active ? 0.3 : 0,
                transition: `opacity 0.6s ease-out ${nodeDelay(6)}ms`,
              }}
            />

            {/* Pilar leaf cards */}
            {pilares.map((pilar) => {
              const Icon = pilar.icon;
              const cardDelay = nodeDelay(4 + pilares.indexOf(pilar));
              return (
                <g
                  key={pilar.label}
                  style={{
                    opacity: active ? 1 : 0,
                    transform: active ? "translateY(0)" : "translateY(8px)",
                    transition: `opacity 0.5s ease-out ${cardDelay}ms, transform 0.5s ease-out ${cardDelay}ms`,
                  }}
                >
                  {/* Leaf dot */}
                  <circle
                    cx={pilar.x}
                    cy={DOTS_Y}
                    r={5}
                    fill="#111439"
                    stroke="#00b2b2"
                    strokeWidth={2}
                  />
                  {/* Card */}
                  <rect
                    x={pilar.x - CARD_W / 2}
                    y={CARDS_Y}
                    width={CARD_W}
                    height={CARD_H}
                    rx={CARD_RX}
                    fill="#ffffff"
                    stroke="#E2E8F0"
                    strokeWidth={1.2}
                  />
                  {/* Icon */}
                  <circle
                    cx={pilar.x - CARD_W / 2 + 32}
                    cy={CARDS_Y + 32}
                    r={20}
                    fill="#F8FAFB"
                  />
                  <foreignObject
                    x={pilar.x - CARD_W / 2 + 12}
                    y={CARDS_Y + 12}
                    width={40}
                    height={40}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <Icon size={22} color="#00b2b2" />
                    </div>
                  </foreignObject>
                  {/* Title */}
                  <text
                    x={pilar.x - CARD_W / 2 + 60}
                    y={CARDS_Y + 34}
                    textAnchor="start"
                    fontSize="20"
                    fontFamily="Space Grotesk, sans-serif"
                    fontWeight="600"
                    fill="#111439"
                  >
                    {pilar.label.split(" ")[0]}
                  </text>
                  {pilar.label.split(" ").length > 1 && (
                    <text
                      x={pilar.x - CARD_W / 2 + 60}
                      y={CARDS_Y + 58}
                      textAnchor="start"
                      fontSize="20"
                      fontFamily="Space Grotesk, sans-serif"
                      fontWeight="600"
                      fill="#111439"
                    >
                      {pilar.label.split(" ").slice(1).join(" ")}
                    </text>
                  )}
                  {/* Divider */}
                  <line
                    x1={pilar.x - CARD_W / 2 + 16}
                    y1={CARDS_Y + 74}
                    x2={pilar.x + CARD_W / 2 - 16}
                    y2={CARDS_Y + 74}
                    stroke="#E2E8F0"
                    strokeWidth={1}
                  />
                  {/* Description */}
                  <foreignObject
                    x={pilar.x - CARD_W / 2 + 16}
                    y={CARDS_Y + 82}
                    width={CARD_W - 32}
                    height={CARD_H - 94}
                  >
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "15px",
                        color: "#3A4A5C",
                        lineHeight: 1.5,
                        margin: 0,
                      }}
                    >
                      {pilar.desc}
                    </p>
                  </foreignObject>
                </g>
              );
            })}

            {/* Vision leaf card */}
            <g
              style={{
                opacity: active ? 1 : 0,
                transition: `opacity 0.5s ease-out ${nodeDelay(5)}ms`,
              }}
            >
              <circle
                cx={VISION_X}
                cy={DOTS_Y}
                r={5}
                fill="#111439"
                stroke="#00b2b2"
                strokeWidth={2}
              />
              <rect
                x={VISION_X - CARD_W / 2}
                y={CARDS_Y}
                width={CARD_W}
                height={CARD_H}
                rx={CARD_RX}
                fill="#ffffff"
                stroke="#E2E8F0"
                strokeWidth={1.2}
              />
              <circle
                cx={VISION_X - CARD_W / 2 + 32}
                cy={CARDS_Y + 32}
                r={20}
                fill="#F8FAFB"
              />
              <foreignObject
                x={VISION_X - CARD_W / 2 + 12}
                y={CARDS_Y + 12}
                width={40}
                height={40}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Eye size={22} color="#5A7A8A" />
                </div>
              </foreignObject>
              <line
                x1={VISION_X - CARD_W / 2 + 16}
                y1={CARDS_Y + 74}
                x2={VISION_X + CARD_W / 2 - 16}
                y2={CARDS_Y + 74}
                stroke="#E2E8F0"
                strokeWidth={1}
              />
              <foreignObject
                x={VISION_X - CARD_W / 2 + 16}
                y={CARDS_Y + 82}
                width={CARD_W - 32}
                height={CARD_H - 94}
              >
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "15px",
                    color: "#3A4A5C",
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {visionText}
                </p>
              </foreignObject>
            </g>
          </svg>
        </div>

        {/* Mobile: stacked cards */}
        <div className="flex flex-col gap-4 lg:hidden">
          <div data-reveal className="reveal">
            <div className="rounded-2xl bg-ink p-5 text-center">
              <p className="eyebrow text-mint mb-1">Raiz</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg" alt="InVitro-Code" className="mx-auto h-8 w-8" />
            </div>
          </div>

          {/* Mobile Mision card */}
          <div data-reveal className="reveal" style={{ transitionDelay: "100ms" }}>
            <div className="rounded-2xl border-l-4 border-mint bg-surface-card p-5">
              <div className="mb-2 flex items-center gap-3">
                <Target size={18} className="text-storm" />
                <h3 className="font-display text-lg font-bold text-ink">
                  Mision
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-slate">
                {missionText}
              </p>
            </div>
          </div>

          {/* Mobile Vision card */}
          <div data-reveal className="reveal" style={{ transitionDelay: "180ms" }}>
            <div className="rounded-2xl border-l-4 border-fog bg-surface-card p-5">
              <div className="mb-2 flex items-center gap-3">
                <Eye size={18} className="text-storm" />
                <h3 className="font-display text-lg font-bold text-ink">
                  Vision
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-slate">
                {visionText}
              </p>
            </div>
          </div>

          {/* Mobile Pilar cards */}
          {pilares.map((pilar, i) => {
            const Icon = pilar.icon;
            return (
              <div
                key={pilar.label}
                data-reveal
                className="reveal"
                style={{ transitionDelay: `${280 + i * 90}ms` }}
              >
                <div className="rounded-2xl border border-surface-raised bg-surface-card p-5">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface">
                      <Icon size={18} className="text-mint" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-ink">
                      {pilar.label}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-slate">
                    {pilar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
