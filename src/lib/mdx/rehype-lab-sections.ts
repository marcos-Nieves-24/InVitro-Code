import type { Root, Element, ElementContent } from "hast";

/**
 * rehype-lab-sections
 *
 * Convention-driven visual upgrade for lab.md markdown. Runs on the HAST
 * tree (after remark → rehype) and rewrites recurring lab markdown
 * conventions into custom elements that are resolved through the MDX
 * `components` map — no lab.md content edits required.
 *
 * Conventions covered (bilingual EN/ES, case-insensitive, accent-insensitive):
 * - `# Lab: <title>`      → `<LabHeader title="<title>"/>`
 * - `## Objetivo/Objective` …      → `<LabCallout kind="objetivo">`
 * - `## Duración/Duration` …       → `<LabCallout kind="duracion">`
 * - `## Dataset/Datasets` …        → `<LabCallout kind="dataset">`
 * - `## Entregables/Deliverables` …→ `<LabCallout kind="entregables">`
 * - `**Preguntas para reflexionar:**` + <ul> → `<ReflectionPrompt label="…">`
 *
 * Section callouts consume every sibling until the next h2/h1 so the whole
 * block (paragraphs, lists, code fences) is wrapped.
 */

type HastChild = ElementContent;

/** Lowercase + strip accents so ES/EN matching is robust. */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** Flatten an element subtree to its text content. */
function toText(node: HastChild | undefined): string {
  if (!node) return "";
  if (node.type === "text") return node.value;
  if (node.type === "element") {
    return (node.children ?? []).map(toText).join("");
  }
  return "";
}

/** True for text nodes that are only whitespace/newlines. */
function isBlankText(node: HastChild): boolean {
  return node.type === "text" && node.value.trim() === "";
}

function makeElement(
  tagName: string,
  properties: Record<string, unknown>,
  children: HastChild[] = [],
): Element {
  return { type: "element", tagName, properties, children } as Element;
}

const SECTION_KINDS: Record<string, string> = {
  objetivo: "objetivo",
  objetivos: "objetivo",
  objective: "objetivo",
  objectives: "objetivo",
  duracion: "duracion",
  duration: "duracion",
  dataset: "dataset",
  datasets: "dataset",
  entregables: "entregables",
  deliverables: "entregables",
};

const REFLECTION_RE =
  /preguntas?\s*(para\s*)?reflexionar|preguntas?\s+de\s+reflexion|reflection\s+question/i;

export default function rehypeLabSections() {
  return (tree: Root) => {
    const children = tree.children as HastChild[];
    const out: HastChild[] = [];

    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      if (node.type !== "element") {
        out.push(node);
        continue;
      }

      const tag = node.tagName;

      // ── 1. Lab header: `# Lab: <title>` / `# Lab N: <title>` → <LabHeader> ──
      if (tag === "h1") {
        const raw = toText(node);
        if (/^lab\s*(?:\d+)?\s*:/i.test(raw)) {
          const title = raw.replace(/^lab\s*(?:\d+\s*)?:/i, "").trim();
          out.push(makeElement("LabHeader", { title }, []));
          continue;
        }
        // Non-lab h1 (e.g. "# Assignment: …") stays a plain heading.
      }

      // ── 2. Known h2 sections → <LabCallout kind=…> ──
      if (tag === "h2") {
        const heading = normalize(toText(node)).trim();
        const kind = SECTION_KINDS[heading];
        if (kind) {
          const title = toText(node).trim();
          const sectionChildren: HastChild[] = [];
          let j = i + 1;
          while (j < children.length) {
            const n = children[j];
            if (
              n.type === "element" &&
              (n.tagName === "h2" || n.tagName === "h1")
            ) {
              break;
            }
            sectionChildren.push(n);
            j++;
          }
          out.push(
            makeElement("LabCallout", { kind, title }, sectionChildren),
          );
          i = j - 1;
          continue;
        }
      }

      // ── 3. Reflection prompt: `**Preguntas para reflexionar:**` + <ul> ──
      if (tag === "p") {
        const text = toText(node);
        if (REFLECTION_RE.test(text)) {
          // Skip whitespace text nodes to find the following <ul>.
          let k = i + 1;
          while (k < children.length && isBlankText(children[k])) k++;
          const next = children[k];
          if (next && next.type === "element" && next.tagName === "ul") {
            const label = text
              .replace(/\*\*/g, "")
              .replace(/[:：]\s*$/, "")
              .trim();
            out.push(makeElement("ReflectionPrompt", { label }, [next]));
            i = k; // consume the <ul> (and any blank text before it)
            continue;
          }
          // No list after the prompt — keep the paragraph as-is.
        }
      }

      out.push(node);
    }

    tree.children = out;
  };
}
