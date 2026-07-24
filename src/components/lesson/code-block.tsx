"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wraps fenced code blocks (```) with an animated Linux terminal look.
 * Commands type in line-by-line; simulated stdout appears after them.
 *
 * Non-code <pre> (ASCII art) falls through unchanged.
 */
export function CodeBlock({ children, className, ...rest }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [showEmulatedOutput, setShowEmulatedOutput] = useState(false);

  const childArray = Array.isArray(children) ? children : [children];
  const codeEl = childArray.find(
    (child: any) =>
      child?.type === "code" ||
      child?.props?.className?.startsWith("language-"),
  ) as
    | React.ReactElement<{ className?: string; children?: React.ReactNode }>
    | undefined;

  const langId = codeEl
    ? extractLanguageId(codeEl.props?.className ?? "")
    : "";
  const languageLabel = codeEl ? displayLanguage(langId) : "";
  const codeText = codeEl ? extractCodeText(codeEl) : "";
  const prompt = langId === "python" ? ">>>" : "$";

  const lines = useMemo(() => {
    if (!codeText) return [] as string[];
    const parts = codeText.split("\n");
    if (parts.length > 1 && parts[parts.length - 1] === "") {
      parts.pop();
    }
    return parts;
  }, [codeText]);

  const totalLines = lines.length;
  const typingDuration = totalLines * 50 + 300;

  const output = useMemo(
    () => (codeEl ? resolveOutput(codeText, langId) : null),
    [codeEl, codeText, langId],
  );

  useEffect(() => {
    if (!output) {
      setShowEmulatedOutput(false);
      return;
    }
    setShowEmulatedOutput(false);
    const timer = window.setTimeout(() => {
      setShowEmulatedOutput(true);
    }, typingDuration + 180);
    return () => window.clearTimeout(timer);
  }, [output, typingDuration, codeText]);

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

  if (!codeEl) {
    return (
      <pre className={className} {...rest}>
        {children}
      </pre>
    );
  }

  const outputLines = output ? output.split("\n") : [];

  return (
    <div className="not-prose group relative my-6 animate-terminal-enter perspective-[600px]">
      <div className="overflow-hidden rounded-xl border border-[#222] bg-[#0a0a0a] shadow-2xl shadow-black/40">
        {/* Title bar */}
        <div className="flex items-center justify-between border-b border-[#1d1d1d] bg-[#111] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
            <span className="ml-3 font-mono text-[12px] font-medium tracking-tight text-[#888]">
              {languageLabel || "terminal"} — {prompt}
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium text-[#888] transition-all hover:bg-[#1d1d1d] hover:text-white active:scale-90"
            aria-label={copied ? "Copiado" : "Copiar código"}
            type="button"
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

        {/* Terminal body — always dark */}
        <div className="relative bg-[#0a0a0a]">
          <pre
            {...rest}
            className="m-0 overflow-x-auto bg-[#0a0a0a] p-4 pb-6 text-sm leading-[1.7] text-[#e6edf3] [font-family:var(--font-mono),ui-monospace,monospace] [font-variant-ligatures:none] [tab-size:4]"
          >
            {lines.map((line, i) => (
              <div
                key={`cmd-${i}`}
                className="animate-code-line whitespace-pre"
                style={{ "--line-index": i } as React.CSSProperties}
              >
                {shouldShowPrompt(line, langId) ? (
                  <TypingPrompt text={prompt} />
                ) : null}
                <span className="text-[#e6edf3]">{line || "\u00A0"}</span>
              </div>
            ))}

            {showEmulatedOutput &&
              outputLines.map((line, i) => (
                <div
                  key={`out-${i}`}
                  className="animate-code-line whitespace-pre text-[#8b949e]"
                  style={{ "--line-index": i } as React.CSSProperties}
                >
                  {line || "\u00A0"}
                </div>
              ))}

            <span
              className="relative inline-block h-[1.1em] w-[0.55em] translate-y-[2px] align-text-bottom bg-[#3fb950] animate-cursor-blink"
              style={
                {
                  "--cursor-delay": `${
                    showEmulatedOutput
                      ? typingDuration + 180 + outputLines.length * 40
                      : typingDuration
                  }ms`,
                } as React.CSSProperties
              }
            />
          </pre>

          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.15) 1px, rgba(255,255,255,0.15) 2px)",
            }}
          />
        </div>
      </div>

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

function TypingPrompt({ text }: { text: string }) {
  return (
    <span className="mr-2 select-none text-[#3fb950]">{text}</span>
  );
}

function shouldShowPrompt(line: string, langId: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;

  if (langId === "python") {
    // REPL-style: prompt on top-level lines (not indented continuations)
    return !line.startsWith(" ") && !line.startsWith("\t");
  }

  // Bash/shell: prompt on real commands, never on comments
  if (trimmed.startsWith("#")) return false;
  return true;
}

function extractLanguageId(className: string): string {
  if (!className) return "";
  const match = className.match(/language-(\w+)/);
  return match?.[1]?.toLowerCase() ?? "";
}

function displayLanguage(langId: string): string {
  const displayNames: Record<string, string> = {
    python: "Python",
    bash: "Bash",
    sh: "Shell",
    shell: "Shell",
    js: "JavaScript",
    javascript: "JavaScript",
    ts: "TypeScript",
    typescript: "TypeScript",
    json: "JSON",
    html: "HTML",
    css: "CSS",
    sql: "SQL",
    yaml: "YAML",
    md: "Markdown",
  };
  return displayNames[langId] ?? langId;
}

/**
 * Resolves simulated terminal/REPL output for the typed commands.
 */
function resolveOutput(code: string, language: string): string | null {
  const trimmed = code.trim();
  if (!trimmed) return null;

  const pythonCMatch = trimmed.match(/^python3?\s+-c\s+(['"])([\s\S]*?)\1/);
  if (pythonCMatch) {
    return resolvePythonOutput(pythonCMatch[2]);
  }

  if (language === "bash" || language === "sh" || language === "shell" || !language) {
    const shellOut = resolveShellOutput(trimmed);
    if (shellOut !== null) return shellOut;
  }

  if (language === "python") {
    return resolvePythonOutput(trimmed);
  }

  // Fallback: treat unknown fenced blocks that look like shell as shell
  if (/^(sudo |python|pip|apt|dnf|brew|npm|git |mkdir |cd |source |venv)/m.test(trimmed)) {
    return resolveShellOutput(trimmed);
  }

  return null;
}

function resolveShellOutput(code: string): string | null {
  const rawLines = code.split("\n");
  const outputs: string[] = [];

  for (const raw of rawLines) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;

    // Split chained commands on &&
    const parts = line.split(/\s*&&\s*/);
    for (const part of parts) {
      const out = resolveSingleShellCommand(part.trim());
      if (out) outputs.push(out);
    }
  }

  if (outputs.length === 0) return null;
  return outputs.join("\n");
}

function resolveSingleShellCommand(cmd: string): string | null {
  if (!cmd) return null;

  // python3 --version / python --version / pip3 --version
  const verMatch = cmd.match(/^([\w.-]+)\s+--version\b/);
  if (verMatch) {
    const tool = verMatch[1].toLowerCase();
    const versions: Record<string, string> = {
      python: "Python 3.12.0",
      python3: "Python 3.12.0",
      pip: "pip 24.0 from /usr/lib/python3.12/site-packages/pip (python 3.12)",
      pip3: "pip 24.0 from /usr/lib/python3.12/site-packages/pip (python 3.12)",
      node: "v22.0.0",
      npm: "10.5.0",
      git: "git version 2.45.0",
      java: 'openjdk version "21.0.2" 2024-01-16 LTS',
      go: "go version go1.22.0 linux/amd64",
      rustc: "rustc 1.77.0 (aedd173a2 2024-03-04)",
      cargo: "cargo 1.77.0",
      tsc: "Version 5.4.0",
      brew: "Homebrew 4.2.0",
    };
    return versions[tool] ?? `${tool} 1.0.0`;
  }

  // echo
  const echoMatch = cmd.match(/^echo\s+(.+)/);
  if (echoMatch) {
    return echoMatch[1].replace(/^["'](.*)["']$/s, "$1").replace(/\\n/g, "\n");
  }

  // apt update
  if (/\bapt(-get)?\s+update\b/.test(cmd)) {
    return "Get:1 http://archive.ubuntu.com/ubuntu noble InRelease [256 kB]\nFetched 256 kB in 1s\nReading package lists... Done\nBuilding dependency tree... Done";
  }

  // apt install
  if (/\bapt(-get)?\s+install\b/.test(cmd)) {
    const pkgs = cmd.replace(/^.*\binstall\s+/, "").replace(/-y\s+/g, "").trim();
    return `Reading package lists... Done\nBuilding dependency tree... Done\nThe following NEW packages will be installed:\n  ${pkgs}\n0 upgraded, ${pkgs.split(/\s+/).length} newly installed.\nSetting up ${pkgs.split(/\s+/)[0]} ...\nProcessing triggers... Done`;
  }

  // dnf / yum install
  if (/\b(dnf|yum)\s+install\b/.test(cmd)) {
    const pkgs = cmd.replace(/^.*\binstall\s+(-y\s+)?/, "").trim();
    return `Dependencies resolved.\n================================================================================\n Package            Architecture    Version           Repository       Size\n================================================================================\nInstalling:\n ${pkgs}\n\nTransaction Summary\n================================================================================\nInstall  ${pkgs.split(/\s+/).length} Packages\n\nComplete!`;
  }

  // brew install
  if (/\bbrew\s+install\b/.test(cmd)) {
    const pkg = cmd.replace(/^.*\binstall\s+/, "").split(/\s+/)[0];
    return `==> Fetching ${pkg}\n==> Pouring ${pkg}... \n🍺  /opt/homebrew/Cellar/${pkg}/3.12.0: 3,000 files, 60MB`;
  }

  // pip / pip3 install -r
  if (/^pip3?\s+install\s+-r\s+/.test(cmd)) {
    return "Collecting packages from requirements.txt\n  Downloading dependencies...\nInstalling collected packages...\nSuccessfully installed all requirements";
  }

  // pip / pip3 install
  if (/^pip3?\s+install\b/.test(cmd)) {
    const pkgs = cmd
      .replace(/^pip3?\s+install\s+/, "")
      .split(/\s+/)
      .filter((p) => p && !p.startsWith("-"));
    if (pkgs.length === 0) return "Successfully installed packages";
    const lines = pkgs.flatMap((pkg) => {
      const name = pkg.replace(/[<>]=?.*$/, "");
      return [
        `Collecting ${name}`,
        `  Downloading ${name}-1.0.0-py3-none-any.whl (42 kB)`,
      ];
    });
    lines.push(`Installing collected packages: ${pkgs.map((p) => p.replace(/[<>]=?.*$/, "")).join(", ")}`);
    lines.push(
      `Successfully installed ${pkgs.map((p) => `${p.replace(/[<>]=?.*$/, "")}-1.0.0`).join(" ")}`,
    );
    return lines.join("\n");
  }

  // pip freeze
  if (/^pip3?\s+freeze\b/.test(cmd)) {
    if (cmd.includes(">")) {
      return null; // redirect — silent
    }
    return "numpy==1.26.4\npandas==2.2.1\nmatplotlib==3.8.3";
  }

  // pip list
  if (/^pip3?\s+list\b/.test(cmd)) {
    return "Package    Version\n---------- -------\npip        24.0\nsetuptools 69.0.0\nnumpy      1.26.4\npandas     2.2.1";
  }

  // python -m venv
  if (/^python3?\s+-m\s+venv\b/.test(cmd)) {
    return null; // silent success
  }

  // activate / source venv
  if (/^(source\s+)?[\w.\\/-]*activate\b/.test(cmd) || /Scripts\\activate/i.test(cmd)) {
    return "(venv) activado";
  }

  // bare python / python3 → REPL banner
  if (/^python3?\s*$/.test(cmd)) {
    return 'Python 3.12.0 (main, Oct  2 2024, 00:00:00) [GCC 13.2.0] on linux\nType "help", "copyright", "credits" or "license" for more information.';
  }

  // jupyter
  if (/^jupyter\s+(notebook|lab)\b/.test(cmd)) {
    const stamp = new Date().toISOString().replace("T", " ").slice(0, 19);
    return `[I ${stamp} ServerApp] Serving notebooks from local directory: /home/user\n[I ${stamp} ServerApp] Jupyter Server 6.5.4 is running at:\n[I ${stamp} ServerApp] http://localhost:8888/tree`;
  }

  // ls / pwd
  if (/^ls\b/.test(cmd)) {
    return "Desktop/  Documents/  Downloads/  notebooks/  project.py  README.md";
  }
  if (/^pwd\s*$/.test(cmd)) {
    return "/home/user";
  }

  // mkdir / cd / touch / rm / mv / cp / chmod — usually silent
  if (/^(mkdir|cd|touch|rm|mv|cp|chmod|chown)\b/.test(cmd)) {
    return null;
  }

  // python script.py
  if (/^python3?\s+\S+\.py\b/.test(cmd)) {
    return "Ejecución completada.";
  }

  // which
  const whichMatch = cmd.match(/^which\s+(\S+)/);
  if (whichMatch) {
    return `/usr/bin/${whichMatch[1]}`;
  }

  return null;
}

function resolvePythonOutput(code: string): string | null {
  const lines = code
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return null;

  const cleanLines = lines
    .map((l) => l.replace(/#.*$/, "").trim())
    .filter(Boolean);
  if (cleanLines.length === 0) return null;

  const outputLines: string[] = [];
  const bindings: Record<string, string> = {};

  for (const line of cleanLines) {
    if (
      /^(import|from|def |class |if |elif |else:|for |while |try:|except|with |async |await )/.test(
        line,
      ) ||
      /^\s*(pass|break|continue|return|yield|raise)\s*$/.test(line)
    ) {
      continue;
    }

    // assignment
    const assignMatch = line.match(/^([A-Za-z_]\w*)\s*=\s*(.+)$/);
    if (assignMatch && !line.includes("==")) {
      const [, name, expr] = assignMatch;
      const evaluated = tryEvalPythonExpr(expr.trim(), bindings);
      if (evaluated !== null) {
        bindings[name] = evaluated;
      } else {
        bindings[name] = expr.trim();
      }
      continue;
    }

    // print(...)
    const printMatch = line.match(/^print\s*\(\s*(.*)\s*\)\s*$/);
    if (printMatch) {
      const inner = printMatch[1].trim();
      const printed = tryEvalPythonExpr(inner, bindings);
      if (printed !== null) {
        outputLines.push(printed);
      } else if (/^f["']/.test(inner)) {
        outputLines.push("<valor calculado>");
      } else if (/^[A-Za-z_]\w*$/.test(inner) && bindings[inner] !== undefined) {
        outputLines.push(stripQuotes(bindings[inner]));
      } else if (/^["']/.test(inner)) {
        outputLines.push(inner.replace(/^["']|["']$/g, ""));
      } else {
        outputLines.push(stripQuotes(inner) || "<argumentos de print>");
      }
      continue;
    }

    // string literal expression
    const strMatch = line.match(/^(["'])((?:(?!\1).)*)\1\s*$/);
    if (strMatch) {
      outputLines.push(strMatch[2]);
      continue;
    }

    // numeric / arithmetic
    const arith = tryEvalPythonExpr(line, bindings);
    if (arith !== null && /^[\d\s+\-*/().]+$/.test(line.replace(/[A-Za-z_]\w*/g, "1"))) {
      outputLines.push(arith);
      continue;
    }

    try {
      if (/^[\d\s+\-*/().]+$/.test(line) && /\d/.test(line)) {
        // eslint-disable-next-line no-new-func
        const result = new Function(`return (${line})`)();
        if (typeof result === "number" && !Number.isNaN(result)) {
          outputLines.push(String(result));
          continue;
        }
      }
    } catch {
      /* ignore */
    }

    if (/^[A-Za-z_]\w*$/.test(line)) {
      outputLines.push(
        bindings[line] !== undefined
          ? stripQuotes(bindings[line])
          : `<${line}>`,
      );
      continue;
    }

    const funcCallMatch = line.match(/^(\w+)\s*\(/);
    if (funcCallMatch) {
      outputLines.push(`<resultado de ${funcCallMatch[1]}()>`);
      continue;
    }
  }

  if (outputLines.length === 0) return null;
  return outputLines.join("\n");
}

function tryEvalPythonExpr(
  expr: string,
  bindings: Record<string, string>,
): string | null {
  const trimmed = expr.trim();

  // string literal
  const strMatch = trimmed.match(/^(["'])((?:(?!\1).)*)\1$/);
  if (strMatch) return strMatch[2];

  // known variable
  if (/^[A-Za-z_]\w*$/.test(trimmed) && bindings[trimmed] !== undefined) {
    return stripQuotes(bindings[trimmed]);
  }

  // replace known vars then evaluate arithmetic
  let replaced = trimmed;
  for (const [name, value] of Object.entries(bindings)) {
    const num = Number(stripQuotes(value));
    if (!Number.isNaN(num)) {
      replaced = replaced.replace(new RegExp(`\\b${name}\\b`, "g"), String(num));
    }
  }

  try {
    if (/^[\d\s+\-*/().]+$/.test(replaced) && /\d/.test(replaced)) {
      // eslint-disable-next-line no-new-func
      const result = new Function(`return (${replaced})`)();
      if (typeof result === "number" && !Number.isNaN(result)) {
        return String(result);
      }
    }
  } catch {
    /* ignore */
  }

  return null;
}

function stripQuotes(value: string): string {
  return value.replace(/^["']|["']$/g, "");
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
