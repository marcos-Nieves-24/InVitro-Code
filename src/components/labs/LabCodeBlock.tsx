"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import { CodeBlock } from "@/components/lesson";

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
 * Extracts the language id from the MDX `<code>` element tree.
 * MDX wraps fenced content in `<pre><code class="language-xxx">…</code></pre>`
 * and the `language-*` class lives on the `<code>` child, not on `<pre>`.
 */
function extractLanguageId(children: React.ReactNode): string {
  if (!children || typeof children !== "object") return "";
  const node = children as { props?: { className?: unknown; children?: React.ReactNode } };
  const cls = node.props?.className;
  if (typeof cls === "string") {
    const m = cls.match(/language-(\w+)/);
    if (m) return m[1].toLowerCase();
  }

  const childNodes = node.props?.children;
  if (!childNodes || typeof childNodes === "string") return "";
  if (Array.isArray(childNodes)) {
    for (const c of childNodes) {
      const id = extractLanguageId(c);
      if (id) return id;
    }
    return "";
  }
  return extractLanguageId(childNodes);
}

/**
 * REQ-LABRUN-02/06: Inspects the MDX-emitted `className` on the `<code>`
 * element. If it's `language-python`, renders a real PyodideRunner.
 * Everything else (bash, shell, text, etc.) renders with the animated
 * terminal CodeBlock.
 */
export function LabCodeBlock({ children, className }: LabCodeBlockProps) {
  const langId =
    extractLanguageId(children) ||
    (className ?? "").replace("language-", "").toLowerCase();

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

  // REQ-LABRUN-06: Everything else (bash, shell, …) renders with the
  // animated terminal CodeBlock already used in lessons (title bar,
  // typing animation, simulated output, copy button).
  return <CodeBlock className={className}>{children}</CodeBlock>;
}
