"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { ComponentProps } from "react";
import { CodeBlock } from "@/components/lesson";

// REQ-LABRUN-04: Lazy-load PyodideRunner with ssr: false so the page
// paints before Pyodide initialises. One worker per code block (MVP).
// Skeleton matches server/client HTML to avoid hydration mismatch
// (server Suspense fallback={null} vs client PyodideRunner div mismatch).
const PyodideRunner = dynamic(
  () => import("@/components/editor/PyodideRunner"),
  {
    ssr: false,
    loading: () => (
      <div
        className="my-6 h-[400px] animate-pulse rounded-xl border bg-[#0a0a0a]"
        aria-hidden="true"
      />
    ),
  },
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
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Server and initial client render the same skeleton to avoid hydration
  // mismatch (RSC serialization makes children shape diverge for language
  // detection). After mount we can safely branch to PyodideRunner vs CodeBlock.
  if (!mounted) {
    return (
      <div
        className="my-6 h-[400px] animate-pulse rounded-xl border bg-[#0a0a0a]"
        aria-hidden="true"
        suppressHydrationWarning
      />
    );
  }

  const langId =
    extractLanguageId(children) ||
    (className ?? "").replace("language-", "").toLowerCase();

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

  return <CodeBlock className={className}>{children}</CodeBlock>;
}
