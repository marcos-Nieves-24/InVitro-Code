"use client";

import { useAnymotionTimeline } from "../hooks/useAnymotionTimeline";
import { AnymotionStage } from "../AnymotionStage";
import { AnymotionControls } from "../AnymotionControls";

const DURATION = 15;

const INPUT_NODES = [
  { id: "x1", y: 280 },
  { id: "x2", y: 540 },
  { id: "x3", y: 800 },
];
const HIDDEN_NODES = [
  { id: "h1", y: 220 },
  { id: "h2", y: 430 },
  { id: "h3", y: 650 },
  { id: "h4", y: 860 },
];
const OUTPUT_NODES = [
  { id: "y1", y: 400 },
  { id: "y2", y: 680 },
];

const LAYER_X = { input: 360, hidden: 960, output: 1560 };
const NODE_R = 38;
const TEAL = "#00f5ff";
const TEAL_DIM = "#007a7d";
const BG = "#0a0a0a";

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

interface NodeProps {
  cx: number;
  cy: number;
  label: string;
  opacity: number;
  scale: number;
}

function NetNode({ cx, cy, label, opacity, scale }: NodeProps) {
  return (
    <g opacity={opacity} transform={`translate(${cx}, ${cy}) scale(${scale})`}>
      <circle r={NODE_R} fill="none" stroke={TEAL} strokeWidth={3} opacity={0.85} />
      <circle r={NODE_R - 8} fill={TEAL} opacity={0.06} />
      <text
        textAnchor="middle"
        dy="5"
        fill="#e0e0e0"
        fontSize={16}
        fontFamily="monospace"
        fontWeight={600}
      >
        {label}
      </text>
    </g>
  );
}

interface ConnectionProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  lineProgress: number;
  pulseT: number;
  weight: string;
}

function Connection({ x1, y1, x2, y2, lineProgress, pulseT, weight }: ConnectionProps) {
  const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const dashOffset = len * (1 - lineProgress);

  const px = x1 + (x2 - x1) * pulseT;
  const py = y1 + (y2 - y1) * pulseT;
  const showPulse = lineProgress >= 1 && pulseT > 0 && pulseT < 1;

  return (
    <g>
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={TEAL_DIM}
        strokeWidth={1.5}
        strokeDasharray={len}
        strokeDashoffset={dashOffset}
        opacity={0.5}
      />
      {showPulse && (
        <circle cx={px} cy={py} r={5} fill={TEAL} opacity={0.9}>
          <animate attributeName="r" from="4" to="7" dur="0.2s" repeatCount="indefinite" />
        </circle>
      )}
      {lineProgress >= 1 && (
        <text
          x={(x1 + x2) / 2}
          y={(y1 + y2) / 2 - 8}
          textAnchor="middle"
          fill={TEAL_DIM}
          fontSize={10}
          fontFamily="monospace"
          opacity={0.6}
        >
          {weight}
        </text>
      )}
    </g>
  );
}

const WEIGHTS = ["0.8", "0.2", "0.5", "0.1", "0.9", "0.4", "0.7", "0.3", "0.6", "0.5", "0.2", "0.8"];

export function NeuralNetworkIntro() {
  const { time, isPlaying, duration, progress, toggle, seek } =
    useAnymotionTimeline({ duration: DURATION, autoPlay: false });

  const p = progress;

  const nodeAppear = (layerIdx: number) => {
    const start = layerIdx * 0.12;
    const t = Math.max(0, Math.min(1, (p - start) / 0.15));
    return easeOutCubic(t);
  };

  const inputOpacity = nodeAppear(0);
  const hiddenOpacity = nodeAppear(1);
  const outputOpacity = nodeAppear(2);

  const connAppear = (fromLayer: number, idx: number) => {
    const start = 0.15 + fromLayer * 0.18 + idx * 0.02;
    const t = Math.max(0, Math.min(1, (p - start) / 0.12));
    return t;
  };

  const pulseT = (fromLayer: number) => {
    const start = 0.35 + fromLayer * 0.22;
    const dur = 0.18;
    const t = (p - start) / dur;
    if (t < 0 || t > 1) return t < 0 ? 0 : 1;
    return t;
  };

  const titleOpacity = Math.max(0, Math.min(1, (p - 0.05) / 0.1));
  const legendOpacity = Math.max(0, Math.min(1, (p - 0.4) / 0.1));

  return (
    <figure className="my-5 first:mt-0">
      <AnymotionStage title="Red neuronal feedforward">
        <svg viewBox="0 0 1920 1080" className="h-full w-full">
          <rect width="1920" height="1080" fill={BG} />

          {/* Title */}
          <text
            x={960} y={90}
            textAnchor="middle"
            fill="#ffffff"
            fontSize={48}
            fontFamily="sans-serif"
            fontWeight={700}
            opacity={titleOpacity}
          >
            Red Neuronal Feedforward
          </text>

          {/* Connections: Input → Hidden */}
          {INPUT_NODES.map((inp, i) =>
            HIDDEN_NODES.map((hid, j) => {
              const prog = connAppear(0, i * 4 + j);
              const pulse = pulseT(0);
              return (
                <Connection
                  key={`i${i}-h${j}`}
                  x1={LAYER_X.input} y1={inp.y}
                  x2={LAYER_X.hidden} y2={hid.y}
                  lineProgress={prog}
                  pulseT={pulse}
                  weight={WEIGHTS[i * 4 + j]}
                />
              );
            }),
          )}

          {/* Connections: Hidden → Output */}
          {HIDDEN_NODES.map((hid, i) =>
            OUTPUT_NODES.map((out, j) => {
              const prog = connAppear(1, i * 2 + j);
              const pulse = pulseT(1);
              return (
                <Connection
                  key={`h${i}-o${j}`}
                  x1={LAYER_X.hidden} y1={hid.y}
                  x2={LAYER_X.output} y2={out.y}
                  lineProgress={prog}
                  pulseT={pulse}
                  weight={WEIGHTS[12 + i * 2 + j] ?? "0.5"}
                />
              );
            }),
          )}

          {/* Nodes */}
          {INPUT_NODES.map((n) => (
            <NetNode key={n.id} cx={LAYER_X.input} cy={n.y} label={n.id}
              opacity={inputOpacity} scale={inputOpacity} />
          ))}
          {HIDDEN_NODES.map((n) => (
            <NetNode key={n.id} cx={LAYER_X.hidden} cy={n.y} label={n.id}
              opacity={hiddenOpacity} scale={hiddenOpacity} />
          ))}
          {OUTPUT_NODES.map((n) => (
            <NetNode key={n.id} cx={LAYER_X.output} cy={n.y} label={n.id}
              opacity={outputOpacity} scale={outputOpacity} />
          ))}

          {/* Layer labels */}
          <text x={LAYER_X.input} y={150} textAnchor="middle" fill={TEAL} fontSize={20}
            fontFamily="monospace" opacity={inputOpacity}>Entrada</text>
          <text x={LAYER_X.hidden} y={150} textAnchor="middle" fill={TEAL} fontSize={20}
            fontFamily="monospace" opacity={hiddenOpacity}>Oculta</text>
          <text x={LAYER_X.output} y={150} textAnchor="middle" fill={TEAL} fontSize={20}
            fontFamily="monospace" opacity={outputOpacity}>Salida</text>

          {/* Legend */}
          <g opacity={legendOpacity}>
            <text x={960} y={1000} textAnchor="middle" fill="#888" fontSize={18}
              fontFamily="monospace">
              → Forward Pass
            </text>
          </g>
        </svg>
      </AnymotionStage>

      <AnymotionControls
        isPlaying={isPlaying}
        currentTime={time}
        duration={duration}
        speed={1}
        onPlayPause={toggle}
        onSeek={seek}
      />
    </figure>
  );
}