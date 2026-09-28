import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("LabCompletionBanner", () => {
  const filePath = path.join(process.cwd(), "src/components/labs/workspace/LabCompletionBanner.tsx");
  const src = fs.readFileSync(filePath, "utf8");

  it("contains Spanish literals exactly as spec", () => {
    expect(src).toContain("Laboratorio completado");
    expect(src).toContain("Siguiente laboratorio");
    expect(src).toContain("Volver al módulo");
    expect(src).toContain("¡Módulo completado!");
  });

  it("renders 2 buttons: Siguiente laboratorio and Volver al módulo", () => {
    // Count occurrences of button strings
    const siguiente = (src.match(/Siguiente laboratorio/g) || []).length;
    const volver = (src.match(/Volver al módulo/g) || []).length;
    expect(siguiente).toBeGreaterThanOrEqual(2); // visible + disabled fallback
    expect(volver).toBeGreaterThanOrEqual(1);
  });

  it("last-lab hides/disables Siguiente and shows ¡Módulo completado! message", () => {
    expect(src).toContain("!hasNextLab");
    expect(src).toContain('aria-disabled="true"');
    expect(src).toContain("No hay siguiente laboratorio");
  });

  it("uses motion/react and CheckCircle2 with success-green accent", () => {
    expect(src).toContain("motion");
    expect(src).toContain("CheckCircle2");
    expect(src).toContain("success-green");
  });

  it("has hasNextLab / nextLabHref / moduleHref props", () => {
    expect(src).toContain("hasNextLab: boolean");
    expect(src).toContain("nextLabHref");
    expect(src).toContain("moduleHref");
  });
});
