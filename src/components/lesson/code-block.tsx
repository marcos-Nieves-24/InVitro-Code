"use client"

import { useState, useCallback } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wraps fenced code blocks (```) with:
 * - A card-style container with dark background
 * - A language badge extracted from className="language-xxx"
 * - A copy-to-clipboard button with brief "Copied!" feedback
 * - A fade-in + slide-up animation on mount
 *
 * Plain <pre> elements (without a <code> child) fall through unchanged.
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

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
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
    <div className="group relative my-5 animate-code-fade-in">
      {/* Header bar */}
      <div className="flex items-center justify-between rounded-t-xl border border-b-0 border-gray-700 bg-gray-800 px-4 py-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-gray-400">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium text-gray-400 transition-all hover:bg-gray-700 hover:text-gray-200 active:scale-95"
          aria-label={copied ? "Copiado" : "Copiar código"}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-teal-400" />
              <span className="text-teal-400">Copiado</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copiar</span>
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <pre
        {...rest}
        className="overflow-x-auto rounded-b-xl border border-gray-700 bg-gray-900 p-4 text-sm leading-relaxed shadow-inner"
      >
        {codeEl}
      </pre>
    </div>
  );
}

/** Extract language from "language-python" → "python" */
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
