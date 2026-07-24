"use client"

import { useState, useCallback, useMemo } from "react";
import { Check, Copy, ChevronDown, ChevronRight, Terminal } from "lucide-react";

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wraps fenced code blocks (```) with an animated Linux terminal look.
 * Code text appears line-by-line with a typing animation.
 *
 *  ┌─[○ ● ○]─[Python — >>>]─[📋 Copiar]─┐
 *  │ $ git init                            │  ← line enters
 *  │ >>> print("hi")                       │  ← line enters
 *  │ █                                    │  ← blinks after all lines
 *  ├─[▶ Mostrar resultado]────────────────┤
 *  │ Python 3.12.0                        │  ← expected output
 *  └───────────────────────────────────────┘
 *
 * Non-code <pre> (ASCII art) falls through unchanged.
 */
export function CodeBlock({ children, className, ...rest }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  // Detect fenced code block: <pre><code className="language-...">
  const childArray = Array.isArray(children) ? children : [children];
  const codeEl = childArray.find(
    (child: any) => child?.type === "code" || child?.props?.className?.startsWith("language-"),
  ) as React.ReactElement<{ className?: string; children?: React.ReactNode }> | undefined;

  if (!codeEl) {
    return <pre className={className} {...rest}>{children}</pre>;
  }

  const language = extractLanguage(codeEl.props?.className ?? "");
  const codeText = extractCodeText(codeEl);
  const prompt = language === "python" ? ">>>" : "$";

  // Split code into lines for typing animation
  const lines = useMemo(() => {
    const parts = codeText.split("\n");
    // Drop trailing empty line (from final newline in markdown)
    if (parts.length > 1 && parts[parts.length - 1] === "") {
      parts.pop();
    }
    return parts;
  }, [codeText]);

  const totalLines = lines.length;
  // Each line types for 50ms; cursor starts blinking after all lines appear
  const typingDuration = totalLines * 50 + 300;

  const output = useMemo(() => resolveOutput(codeText, language), [codeText, language]);

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
      <div className="overflow-hidden rounded-xl border border-[#222] bg-black shadow-2xl shadow-black/40">
        {/* ── Title bar ── */}
        <div className="flex items-center justify-between border-b border-[#1d1d1d] bg-[#111] px-4 py-2.5">
          {/* macOS traffic-light dots */}
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
            <span className="ml-3 font-mono text-[12px] font-medium tracking-tight text-[#888]">
              {language || "terminal"} — {prompt}
            </span>
          </div>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium text-[#888] transition-all hover:bg-[#1d1d1d] hover:text-white active:scale-90"
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

        {/* ── Code body with line-by-line typing ── */}
        <div className="relative">
          <pre
            {...rest}
            className="overflow-x-auto p-4 pb-6 text-sm leading-[1.7] text-white [font-family:var(--font-mono),monospace] [font-variant-ligatures:none] [tab-size:4]"
          >
            {lines.map((line, i) => (
              <div
                key={i}
                className="animate-code-line"
                style={{ "--line-index": i } as React.CSSProperties}
              >
                {i === 0 ? <TypingPrompt text={prompt} /> : null}
                {line || "\u00A0"}
              </div>
            ))}
            {/* Blinking cursor — waits for all lines to appear */}
            <span
              className="relative inline-block h-[1.1em] w-[0.55em] translate-y-[2px] align-text-bottom bg-[#3fb950] animate-cursor-blink"
              style={{ "--cursor-delay": `${typingDuration}ms` } as React.CSSProperties}
            />
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

        {/* ── Respuesta (expected output) toggle ── */}
        {output && (
          <div className="border-t border-[#1d1d1d]">
            <button
              onClick={() => setShowOutput((prev) => !prev)}
              className="flex w-full items-center gap-2 px-4 py-2 text-[11px] font-medium tracking-wide text-[#666] uppercase transition-all hover:bg-[#0a0a0a] hover:text-[#999]"
            >
              {showOutput ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
              <Terminal className="h-3 w-3" />
              <span>Respuesta</span>
            </button>

            {showOutput && (
              <div className="animate-slide-down border-t border-[#1d1d1d] bg-[#0a0a0a] px-4 py-3">
                <pre className="m-0 text-sm leading-[1.6] text-[#a0aec0] [font-family:var(--font-mono),monospace] [font-variant-ligatures:none]">
                  {output}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Glow effect on hover ── */}
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

// ─── TypingPrompt: renders the prompt symbol ($ or >>>) on the first line ──

function TypingPrompt({ text }: { text: string }) {
  return (
    <span className="mr-2 select-none text-[#3fb950]">{text}</span>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────

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

/**
 * Resolves the expected output of a code block for the "Respuesta" button.
 * Handles common educational patterns:
 *   Bash: --version, echo, pip install, pip --version, inline python -c
 *   Python: print(), top-level expressions, assignments
 */
function resolveOutput(code: string, language: string): string | null {
  const trimmed = code.trim();
  const lines = trimmed.split("\n").map((l) => l.trim());

  // ── Detect inline Bash python -c "..." ──
  const pythonCMatch = trimmed.match(/^python\s+-c\s+(['"])([\s\S]*?)\1/);
  if (pythonCMatch) {
    return resolvePythonOutput(pythonCMatch[2], ">>>");
  }

  if (language === "bash" || language === "sh" || language === "shell") {
    // Strip comments for analysis
    const cleanLines = lines
      .map((l) => l.replace(/#.*$/, "").trim())
      .filter(Boolean);

    // --version commands
    const verMatch = trimmed.match(/(\w[\w.-]*)\s+--version/);
    if (verMatch) {
      const tool = verMatch[1].toLowerCase();
      const versions: Record<string, string> = {
        python: "Python 3.12.0",
        pip: "pip 24.0 from /usr/lib/python3.12/site-packages/pip (python 3.12)",
        node: "v22.0.0",
        npm: "10.5.0",
        git: "git version 2.45.0",
        java: 'openjdk version "21.0.2" 2024-01-16 LTS',
        go: "go version go1.22.0 linux/amd64",
        rustc: "rustc 1.77.0 (aedd173a2 2024-03-04)",
        cargo: "cargo 1.77.0",
        tsc: "Version 5.4.0",
        "jupyter --version": "6.5.4",
      };
      if (versions[tool]) return versions[tool];
      if (tool === "jupyter") return versions["jupyter --version"] ?? `${tool} --version`;
      return `${tool} 1.0.0`;
    }

    // echo commands
    const echoMatch = trimmed.match(/echo\s+(.+)/);
    if (echoMatch) {
      return echoMatch[1].replace(/^["'](.*)["']$/, "$1").replace(/\\n/g, "\n");
    }

    // pip install
    if (/^pip\s+install/.test(trimmed)) {
      const pkg = trimmed.replace(/^pip\s+install\s+/, "").split(/\s+/)[0];
      const name = pkg.replace(/[<>]=?.*$/, "");
      return `Collecting ${name}\n  Downloading ${name}-1.0.0-py3-none-any.whl (12 kB)\nInstalling collected packages: ${name}\nSuccessfully installed ${name}-1.0.0`;
    }

    // jupyter notebook
    if (/^jupyter\s+(notebook|lab)/.test(trimmed)) {
      return `[I ${new Date().toISOString().replace("T", " ").slice(0, 19)} ServerApp] Serving notebooks from local directory: /home/user\n[I ${new Date().toISOString().replace("T", " ").slice(0, 19)} ServerApp] Jupyter Server ${Math.random() > 0.5 ? "6.5.4" : "7.0.0"} is running at:\n[I ${new Date().toISOString().replace("T", " ").slice(0, 19)} ServerApp] http://localhost:8888/tree`;
    }

    // ls
    if (/^ls\s*$/.test(trimmed)) {
      return "Desktop/  Documents/  Downloads/  notebooks/  project.py  README.md";
    }

    // pwd
    if (/^pwd\s*$/.test(trimmed)) {
      return "/home/user";
    }

    // mkdir / cd / touch
    if (/^(mkdir|cd|touch|rm|mv|cp)\s/.test(trimmed)) {
      return null; // no visible output, don't show button
    }

    // python script.py — no output to guess
    if (/^python\s+\w+\.py/.test(trimmed)) {
      return "Ejecutá el script para ver el resultado.";
    }

    // If we still have commands after stripping comments, show generic execution
    if (cleanLines.length > 0) {
      return null;
    }

    return null;
  }

  if (language === "python") {
    return resolvePythonOutput(trimmed, ">>>");
  }

  return null;
}

/**
 * Resolves output for pure Python code.
 */
function resolvePythonOutput(code: string, prompt: string): string | null {
  const lines = code.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return null;

  // Strip comments
  const cleanLines = lines
    .map((l) => l.replace(/#.*$/, "").trim())
    .filter(Boolean);
  if (cleanLines.length === 0) return null;

  const outputLines: string[] = [];

  for (const line of cleanLines) {
    // Skip pure imports, function/class definitions, control flow
    if (
      /^(import|from|def |class |if |elif |else:|for |while |try:|except|with |async |await )/.test(line) ||
      /^\s*(pass|break|continue|return|yield|raise)\s*$/.test(line)
    ) {
      continue;
    }

    // Assignment — no output (but check if it's a REPL-style expression)
    if (/^[\w.]+\s*=\s*/.test(line) && !line.includes("==")) {
      continue;
    }

    // print("text") / print('text')
    const printMatch = line.match(
      /^print\s*\(\s*(["'])((?:(?!\1).)*)\1\s*\)\s*$/,
    );
    if (printMatch) {
      outputLines.push(printMatch[2]);
      continue;
    }

    // print(f"...") — show placeholder
    if (/^print\s*\(\s*f["']/.test(line)) {
      outputLines.push("<valor calculado>");
      continue;
    }

    // print(variable) — single arg, not a literal
    if (/^print\s*\(\s*[a-zA-Z_]\w*\s*\)\s*$/.test(line)) {
      outputLines.push("<valor de la variable>");
      continue;
    }

    // print(multiple, args)
    if (/^print\s*\(/.test(line)) {
      outputLines.push("<argumentos de print>");
      continue;
    }

    // String literal as expression ("hello")
    const strMatch = line.match(
      /^(["'])((?:(?!\1).)*)\1\s*$/,
    );
    if (strMatch) {
      outputLines.push(strMatch[2]);
      continue;
    }

    // Numeric expression: 2 + 2, 10 * 5, etc.
    try {
      // Safe arithmetic only — no function calls, no identifiers
      if (/^[\d\s+\-*/().]+$/.test(line) && /[\d]/.test(line)) {
        // eslint-disable-next-line no-new-func
        const result = new Function(`return (${line})`)();
        if (typeof result === "number" && !Number.isNaN(result)) {
          outputLines.push(String(result));
          continue;
        }
      }
    } catch {
      // not a safe expression
    }

    // Variable reference (last line, simple name)
    if (/^[a-zA-Z_]\w*$/.test(line)) {
      outputLines.push(`<${line}>`);
      continue;
    }

    // len(), type(), etc
    const funcCallMatch = line.match(/^(\w[\w]*)\s*\(/);
    if (funcCallMatch) {
      outputLines.push(`<resultado de ${funcCallMatch[1]}()`);
      continue;
    }
  }

  if (outputLines.length === 0) return null;
  return outputLines.join("\n");
}

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
