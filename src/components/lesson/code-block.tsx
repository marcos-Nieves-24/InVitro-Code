"use client"

import { useState, useCallback } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wraps fenced code blocks (```) with an animated Linux terminal look:
 *
 *  ┌─[○ ● ○]─[bash]─[📋]─┐
 *  │ $ command ―            │  ← blinking cursor
 *  │ >>> print("hi") ―      │
 *  └────────────────────────┘
 *
 * Features:
 * - macOS-style traffic light dots (close/minimize/maximize)
 * - Terminal prompt symbol ($ for bash, >>> for Python)
 * - Blinking cursor at end of code
 * - Terminal "power-on" expansion animation
 * - Copy-to-clipboard button
 *
 * Plain <pre> elements (ASCII art) fall through unchanged.
 */
export function CodeBlock({ children, className, ...rest }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  // Detect if this is a fenced code block: <pre><code className="language-...">
  const childArray = Array.isArray(children) ? children : [children];
  const codeEl = childArray.find(
    (child: any) => child?.type === "code" || child?.props?.className?.startsWith("language-"),
  ) as React.ReactElement<{ className?: string; children?: React.ReactNode }> | undefined;

  if (!codeEl) {
    // Not a code block — render as plain <pre> (e.g. ASCII diagrams)
    return <pre className={className} {...rest}>{children}</pre>;
  }

  const language = extractLanguage(codeEl.props?.className ?? "");
  const codeText = extractCodeText(codeEl);
  const prompt = language === "python" ? ">>>" : "$";

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = codeText;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [codeText]);

  return (
    <div className="group relative my-6 animate-terminal-enter perspective-[600px]">
      {/* ── Terminal window ── */}
      <div className="overflow-hidden rounded-xl border border-[#30363d] bg-[#0d1117] shadow-2xl shadow-black/40 backdrop-blur-sm">
        {/* ── Title bar ── */}
        <div className="flex items-center justify-between border-b border-[#21262d] bg-[#161b22] px-4 py-2.5">
          {/* macOS traffic-light dots */}
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff5f56] transition-colors hover:brightness-110" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e] transition-colors hover:brightness-110" />
            <span className="h-3 w-3 rounded-full bg-[#27c93f] transition-colors hover:brightness-110" />
            <span className="ml-3 font-mono text-[12px] font-medium tracking-tight text-[#8b949e]">
              {language || "terminal"} — {prompt}
            </span>
          </div>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium text-[#8b949e] transition-all hover:bg-[#21262d] hover:text-[#e6edf3] active:scale-90"
            aria-label={copied ? "Copiado" : "Copiar código"}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-[#3fb950]" />
                <span className="text-[#3fb950]">Copiado</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copiar</span>
              </>
            )}
          </button>
        </div>

        {/* ── Code body ── */}
        <div className="relative">
          <pre
            {...rest}
            className="overflow-x-auto p-4 pb-6 text-sm leading-[1.7] text-[#e6edf3] [font-family:var(--font-mono),monospace] [font-variant-ligatures:none] [tab-size:4]"
          >
            {codeEl}
            {/* Terminal cursor — blinks forever */}
            <span className="relative inline-block h-[1.1em] w-[0.55em] translate-y-[2px] align-text-bottom bg-[#3fb950] animate-cursor-blink" />
          </pre>

          {/* Subtle scan-line overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.15) 1px, rgba(255,255,255,0.15) 2px)",
            }}
          />
        </div>
      </div>

      {/* ── Glow effect ── */}
      <div
        className="pointer-events-none absolute -inset-[1px] -z-10 rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(135deg, rgba(63,185,80,0.08), transparent 40%, transparent 60%, rgba(63,185,80,0.04))",
          filter: "blur(12px)",
        }}
      />
    </div>
  );
}

/** Extract language from "language-python" → "Python" */
function extractLanguage(className: string): string {
  if (!className) return "";
  const match = className.match(/language-(\w+)/);
  if (!match) return "";
  const lang = match[1];
  const displayNames: Record<string, string> = {
    python: "Python",
    bash: "Bash",
    sh: "Shell",
    js: "JavaScript",
    ts: "TypeScript",
    json: "JSON",
    html: "HTML",
    css: "CSS",
    sql: "SQL",
    yaml: "YAML",
    md: "Markdown",
  };
  return displayNames[lang] ?? lang;
}

/** Recursively extract plain text from a React element tree */
function extractCodeText(el: React.ReactNode): string {
  if (typeof el === "string") return el;
  if (typeof el === "number") return String(el);
  if (!el || typeof el !== "object") return "";

  const node = el as { props?: { children?: React.ReactNode } };
  if (Array.isArray(node)) return node.map(extractCodeText).join("");

  const children = node.props?.children;
  if (!children) return "";
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(extractCodeText).join("");

  return extractCodeText(children);
}
