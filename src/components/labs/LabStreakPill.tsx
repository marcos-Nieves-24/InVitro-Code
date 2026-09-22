interface LabStreakPillProps {
  icon: React.ReactNode;
  value: string | number;
  label?: string;
  accent?: string;
}

/**
 * Reusable pill for streak, XP, or any metric display.
 * Used in LabHub headers and LabHero HUD.
 */
export function LabStreakPill({
  icon,
  value,
  label,
  accent = "#00B2B2",
}: LabStreakPillProps) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold"
      style={{
        borderColor: `${accent}33`,
        backgroundColor: `${accent}0D`,
        color: accent,
      }}
    >
      {icon}
      {label && <span className="sr-only">{label}</span>}
      <span aria-hidden="true">{value}</span>
    </span>
  );
}
