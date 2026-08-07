"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

// REQ-LABRUN-04: Lazy-load PyodideRunner with ssr: false so the page
// paints before Pyodide initialises. One worker per code block (MVP).
const PyodideRunner = dynamic(
  () => import("@/components/editor/PyodideRunner"),
  { ssr: false },
);

interface LabCodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Extracts the inner text from an MDX `<code>` element tree.
 * MDX wraps fenced content in `<pre><code class="language-xxx">...</code></pre>`.
 */
function extractCodeText(children: React.ReactNode): string {
  // Single code element
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (!children || typeof children !== "object") return "";

  const node = children as { props?: { children?: React.ReactNode } };

  // If it's a <code> element, recurse into its children
  if (typeof node === "object" && "props" in node && node.props?.children) {
    const childNodes = node.props.children;
    if (typeof childNodes === "string") return childNodes;
    if (Array.isArray(childNodes)) {
      return childNodes
        .map((c: React.ReactNode) => {
          if (typeof c === "string") return c;
          if (c && typeof c === "object" && "props" in c) {
            const el = c as { props?: { children?: React.ReactNode } };
            return extractCodeText(el.props?.children);
          }
          return "";
        })
        .join("");
    }
    // Nested object — try children
    if (
      childNodes &&
      typeof childNodes === "object" &&
      "props" in childNodes
    ) {
      const inner = childNodes as { props?: { children?: React.ReactNode } };
      return extractCodeText(inner.props?.children);
    }
  }

  return "";
}

/**
 * REQ-LABRUN-02/06: Inspects the MDX-emitted `className` on the `<code>`
 * element. If it's `language-python`, renders a real PyodideRunner.
 * Everything else (bash, shell, text, etc.) renders statically.
 */
export function LabCodeBlock({ children, className }: LabCodeBlockProps) {
  const langId = (className ?? "").replace("language-", "").toLowerCase();

  // REQ-LABRUN-02: Python fences become executable PyodideRunner instances
  if (langId === "python") {
    const code = extractCodeText(children);
    return (
      <PyodideRunner
        defaultValue={code || ""}
        height="400px"
        language="python"
      />
    );
  }

  // REQ-LABRUN-06: Everything else renders statically
  return (
    <div className="my-6">
      <div className="mb-0 flex items-center justify-between rounded-t-lg border border-b-0 border-gray-200 bg-gray-50 px-4 py-2">
        <span className="font-mono text-sm font-semibold text-gray-700">
          {langId || "code"}
        </span>
      </div>
      <pre className="m-0 overflow-x-auto rounded-b-lg border border-gray-200 bg-gray-900 p-4 text-sm leading-relaxed text-green-300 [font-family:var(--font-mono,ui-monospace,monospace)]">
        {children}
      </pre>
    </div>
  );
}
