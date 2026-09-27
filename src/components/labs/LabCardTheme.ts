import type { LucideIcon } from "lucide-react";
import { Dna, Code2, BarChart3, FlaskConical } from "lucide-react";

export interface LabCardTheme {
  accent: string;
  tint: string;
  label: string;
  icon: LucideIcon;
  art: string;
}

export interface SerializableLabCardTheme {
  accent: string;
  tint: string;
  label: string;
  art: string;
}

export function toSerializableTheme(theme: LabCardTheme): SerializableLabCardTheme {
  return { accent: theme.accent, tint: theme.tint, label: theme.label, art: theme.art };
}

const THEMES: Record<string, LabCardTheme> = {
  ia: {
    accent: "#0F161F",
    tint: "#F4F6F8",
    label: "IA",
    icon: Dna,
    art: "/labs/modules/ia.svg",
  },
  python: {
    accent: "#A3CFCD",
    tint: "#E8ECF0",
    label: "Python",
    icon: Code2,
    art: "/labs/modules/python.svg",
  },
  estadistica: {
    accent: "#82A0AA",
    tint: "#F4F6F8",
    label: "Bioestadistica",
    icon: BarChart3,
    art: "/labs/modules/estadistica.svg",
  },
  "machine-learning": {
    accent: "#2A272A",
    tint: "#E8ECF0",
    label: "Machine Learning",
    icon: FlaskConical,
    art: "/labs/modules/ml.svg",
  },
};

const FALLBACK: LabCardTheme = {
  accent: "#677381",
  tint: "#F4F6F8",
  label: "Modulo",
  icon: FlaskConical,
  art: "",
};

export function getLabCardTheme(slug: string): LabCardTheme {
  return THEMES[slug] ?? FALLBACK;
}
