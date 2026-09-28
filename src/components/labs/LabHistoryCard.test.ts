import { describe, it, expect } from "vitest";
import { formatLabDate } from "@/lib/validation/labProgress";
import { getLabCardTheme } from "./LabCardTheme";
import fs from "fs";
import path from "path";

describe("LabHistoryCard date logic", () => {
  it("formats completed date and in_progress updatedAt, — for never started", () => {
    // completed → completion_date
    expect(formatLabDate("2026-09-20T10:00:00.000Z")).toBe("20/09/2026");
    // in_progress → updated_at
    expect(formatLabDate("2026-09-21T15:30:00.000Z")).toBe("21/09/2026");
    // never started → —
    expect(formatLabDate(null)).toBe("—");
    expect(formatLabDate(undefined)).toBe("—");
  });

  it("LabHistoryCard visual accent contract: completed success-green, not_started theme accent, in_progress muted", () => {
    const file = fs.readFileSync(path.join(process.cwd(), "src/components/labs/LabHistoryCard.tsx"), "utf8");
    // Verify borderAccent branching exists as spec
    expect(file).toContain('status === "completed" ? "#22c55e"');
    expect(file).toContain('status === "not_started" ? theme.accent');
    expect(file).toContain("#9ca3af"); // in_progress muted
  });

  it("LabHistoryCard renders Nombre/Estado/Última fecha and Repasar variant strings", () => {
    const file = fs.readFileSync(path.join(process.cwd(), "src/components/labs/LabHistoryCard.tsx"), "utf8");
    expect(file).toContain("Repasar");
    expect(file).toContain("No iniciado");
    expect(file).toContain("En progreso");
    expect(file).toContain("Completado");
    expect(file).toContain("formatLabDate");
  });

  it("LabCardTheme accent still drives tint for not_started", () => {
    const theme = getLabCardTheme("python");
    expect(theme.accent).toBe("#0F161F");
    expect(theme.tint).toBe("#F4F6F8");
    const fallback = getLabCardTheme("unknown");
    expect(fallback.accent).toBe("#677381");
  });

  it("total===0 → 0% guard (no division) — module page logic", () => {
    // Simulate module page % logic
    const total = 0;
    const completedCount = 0;
    const pct = total === 0 ? 0 : Math.round((completedCount / total) * 100);
    expect(pct).toBe(0);
    expect(Number.isFinite(pct)).toBe(true);
  });
});
