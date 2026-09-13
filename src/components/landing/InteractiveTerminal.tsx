"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { RotateCcw } from "lucide-react";
import { DendrogramSVG } from "@/components/landing/DendrogramSVG";

interface CodeLine {
  text: string;
  type: "code" | "output" | "comment";
}

const codeLines: CodeLine[] = [
  { text: "# Analisis de clustering jerarquico", type: "comment" },
  { text: "# sobre datos de expresion genica", type: "comment" },
  { text: "", type: "code" },
  { text: "import pandas as pd", type: "code" },
  { text: "import numpy as np", type: "code" },
  {
    text: "from scipy.cluster.hierarchy import linkage, dendrogram",
    type: "code",
  },
  { text: "from sklearn.preprocessing import StandardScaler", type: "code" },
  { text: "", type: "code" },
  { text: 'data = pd.read_csv("expresion_genica.csv")', type: "code" },
  { text: "scaler = StandardScaler()", type: "code" },
  { text: "scaled = scaler.fit_transform(data)", type: "code" },
  { text: "", type: "code" },
  { text: 'Z = linkage(scaled, method="ward")', type: "code" },
  { text: "dendrogram(Z, labels=data.index)", type: "code" },
  { text: "", type: "code" },
  {
    text: 'print("Clustering completado: 8 genes agrupados")',
    type: "code",
  },
];

const outputLines = [
  ">>> Ejecutando analisis...",
  ">>> Normalizando datos... OK",
  ">>> Calculando linkage (Ward)... OK",
  ">>> Generando dendrograma...",
  ">>> Clustering completado: 8 genes agrupados",
];

function highlightLine(line: string): { text: string; cls: string }[] {
  if (line.startsWith("#")) {
    return [{ text: line, cls: "text-white/40" }];
  }
  if (line.startsWith("print(")) {
    return [
      { text: "print", cls: "text-cyan-400" },
      { text: "(", cls: "text-white/60" },
      { text: line.slice(6, -1), cls: "text-green-300" },
      { text: ")", cls: "text-white/60" },
    ];
  }
  if (line.startsWith("import ") || line.startsWith("from ")) {
    const parts = line.split(" ");
    return [
      { text: parts[0], cls: "text-cyan-400" },
      { text: " " + parts.slice(1).join(" "), cls: "text-white/60" },
    ];
  }
  if (line.includes("=")) {
    const eqIdx = line.indexOf("=");
    return [
      { text: line.slice(0, eqIdx), cls: "text-white" },
      { text: line.slice(eqIdx), cls: "text-white/60" },
    ];
  }
  return [{ text: line, cls: "text-white/70" }];
}

function getPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function InteractiveTerminal() {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState("");
  const [phase, setPhase] = useState<"typing" | "output" | "dendrogram">(
    "typing",
  );
  const [outputDisplayed, setOutputDisplayed] = useState<string[]>([]);
  const [runCount, setRunCount] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotion = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    reducedMotion.current = getPrefersReducedMotion();
  }, []);

  const handleRerun = useCallback(() => {
    setDisplayedLines([]);
    setCurrentLine("");
    setOutputDisplayed([]);
    setPhase("typing");
    setRunCount((c) => c + 1);
  }, []);

  // Phase 1: Typing
  useEffect(() => {
    if (phase !== "typing") return;

    if (reducedMotion.current) {
      setDisplayedLines(codeLines.map((l) => l.text));
      setPhase("output");
      return;
    }

    let lineIdx = 0;
    let charIdx = 0;
    let active = true;

    const tick = () => {
      if (!active) return;
      if (lineIdx >= codeLines.length) {
        setPhase("output");
        return;
      }

      const line = codeLines[lineIdx];

      if (line.text === "") {
        setDisplayedLines((prev) => [...prev, ""]);
        lineIdx++;
        charIdx = 0;
        timeoutRef.current = setTimeout(tick, 50);
        return;
      }

      if (charIdx <= line.text.length) {
        setCurrentLine(line.text.slice(0, charIdx));
        charIdx++;
        timeoutRef.current = setTimeout(tick, 25 + Math.random() * 20);
      } else {
        setDisplayedLines((prev) => [...prev, line.text]);
        setCurrentLine("");
        lineIdx++;
        charIdx = 0;
        timeoutRef.current = setTimeout(tick, 150);
      }
    };

    tick();

    return () => {
      active = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [runCount, phase]);

  // Phase 2: Output
  useEffect(() => {
    if (phase !== "output") return;

    if (reducedMotion.current) {
      setOutputDisplayed(outputLines);
      setPhase("dendrogram");
      return;
    }

    let active = true;
    let idx = 0;

    const tick = () => {
      if (!active) return;
      if (idx >= outputLines.length) {
        setPhase("dendrogram");
        return;
      }
      setOutputDisplayed((prev) => [...prev, outputLines[idx]]);
      idx++;
      timeoutRef.current = setTimeout(tick, 400);
    };

    tick();

    return () => {
      active = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [phase]);

  // Auto-scroll terminal body to the bottom as content is typed/output shown.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayedLines, currentLine, outputDisplayed]);

  // When the dendrogram appears, reset scroll to the top so the tree is visible.
  useEffect(() => {
    if (phase === "dendrogram" && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [phase]);

  // Loop: auto-restart after dendrogram shown
  useEffect(() => {
    if (phase !== "dendrogram") return;

    const loopTimer = setTimeout(() => {
      handleRerun();
    }, 4000);

    return () => clearTimeout(loopTimer);
  }, [phase, handleRerun]);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl shadow-black/50">
      {/* Terminal bar */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-[#1a1a1a] px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-500/60" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/60" />
          <span className="h-3 w-3 rounded-full bg-green-500/60" />
        </div>
        <div className="ml-2 flex items-center gap-2">
          <span className="text-xs text-white/40">python</span>
          <span className="font-mono text-xs text-white/25">
            invitro-code --lab clustering
          </span>
        </div>
        {phase === "dendrogram" && (
          <button
            onClick={handleRerun}
            className="ml-auto flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-white/40 transition-all hover:bg-white/10 hover:text-white/70"
          >
            <RotateCcw size={14} />
            Ejecutar de nuevo
          </button>
        )}
      </div>

      {/* Terminal body — code OR dendrogram */}
      <div ref={scrollRef} className="relative h-[460px] overflow-y-auto p-5 font-mono text-sm text-white/80">
        {/* Code output (typing + output phases) */}
        <div
          className={`transition-opacity duration-300 ${
            phase === "dendrogram" ? "pointer-events-none absolute inset-0 opacity-0" : ""
          }`}
        >
          {displayedLines.map((line, i) => (
            <div key={i} className="whitespace-pre">
              {line === "" ? (
                "\u00A0"
              ) : (
                highlightLine(line).map((part, j) => (
                  <span key={j} className={part.cls}>
                    {part.text}
                  </span>
                ))
              )}
            </div>
          ))}

          {phase === "typing" && currentLine !== "" && (
            <div className="whitespace-pre">
              {highlightLine(currentLine).map((part, j) => (
                <span key={j} className={part.cls}>
                  {part.text}
                </span>
              ))}
              <span className="animate-[typewriter-cursor_1.2s_step-end_infinite] text-green-400">
                &#9612;
              </span>
            </div>
          )}

          {phase === "typing" && currentLine === "" && (
            <span className="animate-[typewriter-cursor_1.2s_step-end_infinite] text-green-400">
              &#9612;
            </span>
          )}

          {phase !== "typing" &&
            outputDisplayed.map((line, i) => (
              <div key={i} className="fade-in-up whitespace-pre text-green-400">
                {line}
              </div>
            ))}
        </div>

        {/* Dendrogram (dendrogram phase) — same container */}
        {phase === "dendrogram" && (
          <div className="fade-in-up overflow-hidden">
            <DendrogramSVG active={phase === "dendrogram"} />
          </div>
        )}
      </div>
    </div>
  );
}
