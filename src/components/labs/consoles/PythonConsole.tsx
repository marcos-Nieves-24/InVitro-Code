"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { TerminalChrome } from "@/components/shared/TerminalChrome";

type CodeLine = { text: string; type: "code" | "comment" };

const codeLines: CodeLine[] = [
  { text: "from Bio import SeqIO", type: "code" },
  { text: "from Bio.SeqRecord import SeqRecord", type: "code" },
  { text: 'record = SeqIO.read("ecoli.fasta", "fasta")', type: "code" },
  { text: 'assembly = SeqRecord(seq="ATGCGTACG...")', type: "code" },
  { text: 'print(f"Genoma {len(record.seq)} bp ensamblado")', type: "code" },
];

const outputLine = "> 4.6 Mbp · 4300 CDS";

const NUCLEOTIDES: { base: string; color: string }[] = [
  { base: "A", color: "#22c55e" },
  { base: "T", color: "#ef4444" },
  { base: "G", color: "#eab308" },
  { base: "C", color: "#3b82f6" },
  { base: "A", color: "#22c55e" },
  { base: "T", color: "#ef4444" },
  { base: "G", color: "#eab308" },
  { base: "C", color: "#3b82f6" },
  { base: "A", color: "#22c55e" },
  { base: "G", color: "#eab308" },
  { base: "T", color: "#ef4444" },
  { base: "C", color: "#3b82f6" },
  { base: "A", color: "#22c55e" },
  { base: "C", color: "#3b82f6" },
  { base: "G", color: "#eab308" },
  { base: "T", color: "#ef4444" },
  { base: "A", color: "#22c55e" },
  { base: "T", color: "#ef4444" },
  { base: "C", color: "#3b82f6" },
  { base: "G", color: "#eab308" },
];

function Highlight({ line }: { line: string }) {
  if (line.startsWith("#")) return <span className="text-white/40">{line}</span>;
  if (line.startsWith("from ") || line.startsWith("import "))
    return <span className="text-cyan-400">{line}</span>;
  return <span className="text-white/80">{line}</span>;
}

export function PythonConsole() {
  const shouldReduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<"typing" | "done">(shouldReduceMotion ? "done" : "typing");
  const [displayed, setDisplayed] = useState<string[]>(
    shouldReduceMotion ? codeLines.map((l) => l.text) : [],
  );
  const [current, setCurrent] = useState("");
  const [showOutput, setShowOutput] = useState(shouldReduceMotion ?? false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (shouldReduceMotion) {
      setPhase("done");
      setShowOutput(true);
      return;
    }
    if (phase !== "typing") return;
    let lineIdx = 0;
    let charIdx = 0;
    let active = true;
    const tick = () => {
      if (!active) return;
      if (lineIdx >= codeLines.length) {
        setPhase("done");
        setTimeout(() => setShowOutput(true), 300);
        return;
      }
      const line = codeLines[lineIdx];
      if (charIdx <= line.text.length) {
        setCurrent(line.text.slice(0, charIdx));
        charIdx++;
        timeoutRef.current = setTimeout(tick, 18 + Math.random() * 14);
      } else {
        setDisplayed((p) => [...p, line.text]);
        setCurrent("");
        lineIdx++;
        charIdx = 0;
        timeoutRef.current = setTimeout(tick, 100);
      }
    };
    tick();
    return () => {
      active = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [phase, shouldReduceMotion]);

  return (
    <TerminalChrome title="python invitro-code --lab python" className="flex flex-col">
      <div className="flex h-[420px] flex-col gap-3 overflow-hidden">
        <div className="flex flex-col gap-0.5 font-mono text-sm">
          {displayed.map((line, i) => (
            <div key={i} className="whitespace-pre">
              <Highlight line={line} />
            </div>
          ))}
          {phase === "typing" && current !== "" && (
            <div className="whitespace-pre">
              <Highlight line={current} />
              <span className="animate-pulse text-green-400">█</span>
            </div>
          )}
          {showOutput && (
            <div className="mt-1 font-mono text-sm text-green-400">{outputLine}</div>
          )}
        </div>

        <div className="mt-1 rounded-lg bg-white/5 p-3">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-white/40">
            A T G C · nucleótidos
          </p>
          <div className="flex gap-1">
            {NUCLEOTIDES.map((n, i) =>
              shouldReduceMotion ? (
                <div
                  key={i}
                  className="h-6 flex-1 rounded-sm"
                  style={{ backgroundColor: n.color }}
                  title={n.base}
                  aria-label={n.base}
                />
              ) : (
                <motion.div
                  key={i}
                  className="h-6 flex-1 rounded-sm"
                  style={{ backgroundColor: n.color }}
                  title={n.base}
                  aria-label={n.base}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={showOutput ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.03, ease: "easeOut" }}
                />
              ),
            )}
          </div>
          <div className="mt-1.5 flex justify-between font-mono text-[10px] text-white/30">
            <span style={{ color: "#22c55e" }}>A</span>
            <span style={{ color: "#ef4444" }}>T</span>
            <span style={{ color: "#eab308" }}>G</span>
            <span style={{ color: "#3b82f6" }}>C</span>
          </div>
        </div>
      </div>
    </TerminalChrome>
  );
}
