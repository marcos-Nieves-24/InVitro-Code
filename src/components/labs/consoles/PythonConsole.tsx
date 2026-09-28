"use client";

import { useEffect, useState, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { TerminalChrome } from "@/components/shared/TerminalChrome";
import { DendrogramSVG } from "@/components/landing/DendrogramSVG";

type CodeLine = { text: string; type: "code" | "comment" };

const codeLines: CodeLine[] = [
  { text: "# Analisis de clustering jerarquico", type: "comment" },
  { text: "import pandas as pd", type: "code" },
  { text: "import numpy as np", type: "code" },
  { text: "from sklearn.preprocessing import StandardScaler", type: "code" },
  { text: 'data = pd.read_csv("expresion_genica.csv")', type: "code" },
  { text: "scaled = StandardScaler().fit_transform(data)", type: "code" },
  { text: 'Z = linkage(scaled, method="ward")', type: "code" },
  { text: 'print("Clustering completado: 8 genes agrupados")', type: "code" },
];

const outputLines = [
  ">>> Ejecutando analisis...",
  ">>> Normalizando datos... OK",
  ">>> Calculando linkage (Ward)... OK",
  ">>> Clustering completado: 8 genes agrupados",
];

function Highlight({ line }: { line: string }) {
  if (line.startsWith("#")) return <span className="text-white/40">{line}</span>;
  if (line.startsWith("import ") || line.startsWith("from "))
    return <span className="text-cyan-400">{line}</span>;
  return <span className="text-white/80">{line}</span>;
}

export function PythonConsole() {
  const shouldReduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<"typing" | "output" | "dendrogram">(
    shouldReduceMotion ? "dendrogram" : "typing",
  );
  const [displayed, setDisplayed] = useState<string[]>(
    shouldReduceMotion ? codeLines.map((l) => l.text) : [],
  );
  const [current, setCurrent] = useState("");
  const [output, setOutput] = useState<string[]>(
    shouldReduceMotion ? outputLines : [],
  );
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // typing
  useEffect(() => {
    if (shouldReduceMotion) {
      setPhase("dendrogram");
      return;
    }
    if (phase !== "typing") return;
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
        setDisplayed((p) => [...p, ""]);
        lineIdx++;
        timeoutRef.current = setTimeout(tick, 50);
        return;
      }
      if (charIdx <= line.text.length) {
        setCurrent(line.text.slice(0, charIdx));
        charIdx++;
        timeoutRef.current = setTimeout(tick, 22 + Math.random() * 18);
      } else {
        setDisplayed((p) => [...p, line.text]);
        setCurrent("");
        lineIdx++;
        charIdx = 0;
        timeoutRef.current = setTimeout(tick, 120);
      }
    };
    tick();
    return () => {
      active = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [phase, shouldReduceMotion]);

  // output
  useEffect(() => {
    if (shouldReduceMotion) return;
    if (phase !== "output") return;
    let idx = 0;
    let active = true;
    const tick = () => {
      if (!active) return;
      if (idx >= outputLines.length) {
        setPhase("dendrogram");
        return;
      }
      setOutput((p) => [...p, outputLines[idx]]);
      idx++;
      timeoutRef.current = setTimeout(tick, 380);
    };
    tick();
    return () => {
      active = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [phase, shouldReduceMotion]);

  return (
    <TerminalChrome title="python invitro-code --lab python" className="flex flex-col">
      <div className="flex h-[420px] flex-col overflow-y-auto">
        {phase !== "dendrogram" ? (
          <div className="flex flex-col gap-0.5 font-mono text-sm">
            {displayed.map((line, i) => (
              <div key={i} className="whitespace-pre">
                {line === "" ? "\u00A0" : <Highlight line={line} />}
              </div>
            ))}
            {phase === "typing" && current !== "" && (
              <div className="whitespace-pre">
                <Highlight line={current} />
                <span className="animate-pulse text-green-400">█</span>
              </div>
            )}
            {phase === "output" &&
              output.map((line, i) => (
                <div key={i} className="whitespace-pre text-green-400">
                  {line}
                </div>
              ))}
          </div>
        ) : (
          <div className="flex-1">
            <DendrogramSVG active />
          </div>
        )}
      </div>
    </TerminalChrome>
  );
}
