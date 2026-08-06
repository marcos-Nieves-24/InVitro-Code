import {
  BarChart3,
  Brain,
  CheckCircle2,
  Cpu,
  Crown,
  Database,
  Flame,
  Gem,
  GraduationCap,
  Rocket,
  Shield,
  Terminal,
  Trophy,
  type LucideIcon,
} from "lucide-react";

const ACHIEVEMENT_ICONS: Record<string, LucideIcon> = {
  GraduationCap,
  Database,
  Brain,
  Flame,
  Gem,
  Terminal,
  BarChart3,
  Cpu,
  Shield,
  Rocket,
  Crown,
  CheckCircle2,
};

/**
 * Resolves an achievement icon name (the `achievements.icon` column, e.g.
 * "GraduationCap") to a Lucide component. Falls back to Trophy for unknown
 * names (real-data-replace-mocks: icons come from the catalog, never
 * hardcoded per card).
 */
export function achievementIcon(name: string | null | undefined): LucideIcon {
  if (name && Object.prototype.hasOwnProperty.call(ACHIEVEMENT_ICONS, name)) {
    return ACHIEVEMENT_ICONS[name];
  }
  return Trophy;
}
