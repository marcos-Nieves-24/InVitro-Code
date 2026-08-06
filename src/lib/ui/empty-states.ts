/**
 * Motivational empty-state copy (real-data-replace-mocks, D1).
 *
 * Principle: honesty > completeness — an empty state beats a fake number.
 * All copy is Spanish (REQ-NFR-02).
 */

export interface EmptyStateCopy {
  title: string;
  description: string;
}

export const EMPTY_STATES: Record<string, EmptyStateCopy> = {
  achievements: {
    title: "Sin logros desbloqueados",
    description: "Completá tu primera lección para desbloquear logros.",
  },
  leaderboard: {
    title: "El ranking todavía está vacío",
    description: "Sé el primero en aparecer en el ranking.",
  },
  activeUsers: {
    title: "Sin investigadores activos",
    description: "Nadie con racha activa todavía — sé la primera chispa.",
  },
  currentProject: {
    title: "Sin proyecto en curso",
    description: "Empezá tu primera lección para ver tu Proyecto Actual.",
  },
  currentMission: {
    title: "Sin misión pendiente",
    description: "Completá una lección para que tu Misión aparezca acá.",
  },
  labProgress: {
    title: "Sin progreso en este laboratorio",
    description: "Ejecutá el código para ver tu progreso real.",
  },
  challengeLab: {
    title: "Ejecutá el modelo en el laboratorio",
    description:
      "Este desafío de calidad de vino se resuelve en las lecciones del módulo de Machine Learning: ahí vas a entrenar tu modelo y ver tus métricas reales.",
  },
};
