// Domain — ModuleCard pure model
// No imports from infrastructure/presentation. Pure math only.
// Theme is resolved in UI (LabCardTheme), not here — keeps dependency direction clean.

export interface ModuleCardModel {
  slug: string;
  title: string;
  description: string;
  lessonCount: number;
  labCount: number;
  xpReward: number;
  completed: number | null;
  total: number | null;
  progressPct: number | null;
}

export function buildModuleCardModel(params: {
  slug: string;
  title: string;
  description: string;
  lessonCount: number;
  xpReward: number;
  labCount?: number;
  completed?: number | null;
  total?: number | null;
}): ModuleCardModel {
  const { slug, title, description, lessonCount, xpReward } = params;
  const labCount = params.labCount ?? lessonCount;
  const completed = params.completed ?? null;
  const total = params.total ?? lessonCount;

  const progressPct =
    completed !== null && total !== null && total > 0
      ? Math.round((completed / total) * 100)
      : null;

  return {
    slug,
    title,
    description,
    lessonCount,
    labCount,
    xpReward,
    completed,
    total,
    progressPct,
  };
}
