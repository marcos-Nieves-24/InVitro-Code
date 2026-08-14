import { describe, it, expect } from "vitest";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeLabSections from "./rehype-lab-sections";

type HastNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

function transform(source: string): HastNode {
  const mdast = unified().use(remarkParse).use(remarkGfm).parse(source);
  return unified().use(remarkRehype).use(rehypeLabSections).runSync(mdast) as HastNode;
}

function collectTags(tree: HastNode, prefix: string): string[] {
  const out: string[] = [];
  const walk = (n: HastNode) => {
    if (!n.children) return;
    for (const c of n.children) {
      if (c.type === "element") {
        if (
          c.tagName &&
          (c.tagName.startsWith(prefix) || c.tagName === "ReflectionPrompt")
        ) {
          const kind = c.properties?.kind as string | undefined;
          const label = c.properties?.label as string | undefined;
          out.push(c.tagName + (kind ? `[${kind}]` : "") + (label ? `("${label}")` : ""));
        }
        walk(c);
      }
    }
  };
  walk(tree);
  return out;
}

const esSample = `# Lab: Exploración de Features

## Objetivo

Aplicar los conceptos.

## Duración

75 minutos

## Dataset

Usamos el dataset.

\`\`\`python
from sklearn.datasets import load_breast_cancer
\`\`\`

## Instrucciones

### Parte 1: Carga (10 min)

Cargá el dataset.

**Preguntas para reflexionar:**
- ¿Cuántas muestras tiene?
- ¿Están balanceadas?

## Entregables

Entregá un notebook.

## Rúbrica

| Criterio | Puntos |
|----------|--------|
| Carga | 2 |
`;

const enSample = `# Lab 1: ML Fundamentals

## Objective

Apply concepts.

## Duration

45 minutes

## Instructions

**Reflection questions:**
- What does the mean tell you?

## Deliverables

Submit a script.
`;

describe("rehypeLabSections", () => {
  it("wraps ES conventional sections into Lab components", () => {
    const tree = transform(esSample);
    const tags = collectTags(tree, "Lab");
    expect(tags).toContain("LabHeader");
    expect(tags).toContain("LabCallout[objetivo]");
    expect(tags).toContain("LabCallout[duracion]");
    expect(tags).toContain("LabCallout[dataset]");
    expect(tags).toContain("LabCallout[entregables]");
    expect(tags).toContain('ReflectionPrompt("Preguntas para reflexionar")');
    // Rúbrica heading + table stay as plain h2/table
    expect(tags.filter((t) => t.startsWith("LabCallout") && t.includes("rubrica"))).toHaveLength(0);
  });

  it("matches EN headings and Lab N: titles", () => {
    const tree = transform(enSample);
    const tags = collectTags(tree, "Lab");
    const header = tags.find((t) => t.startsWith("LabHeader"));
    expect(header).toBeDefined();
    // The number in "Lab 1:" must be stripped from the title
    expect(header).not.toContain("Lab 1");
    expect(tags).toContain("LabCallout[objetivo]");
    expect(tags).toContain('ReflectionPrompt("Reflection questions")');
    expect(tags).toContain("LabCallout[entregables]");
  });

  it("keeps non-lab h1 (Assignment) as a plain heading", () => {
    const tree = transform("# Assignment: Mi proyecto\n\n## Objetivos\n\nHacer algo.\n");
    const tags = collectTags(tree, "Lab");
    expect(tags).not.toContain("LabHeader");
    expect(tags).toContain("LabCallout[objetivo]");
  });

  it("extracts the title without the 'Lab:' prefix", () => {
    const tree = transform("# Lab: Exploración de Features\n");
    const header = collectTags(tree, "Lab").find((t) => t.startsWith("LabHeader"));
    expect(header).toBe('LabHeader');
  });
});
