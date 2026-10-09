import { Shield, ShieldCheck, ShieldOff } from "lucide-react";

export interface StreakFreezeBadgeProps {
  freezesAvailable: 0 | 1;
  lastFreezeUsed?: string | null;
  compact?: boolean;
}

export function StreakFreezeBadge({
  freezesAvailable,
  lastFreezeUsed,
  compact = false,
}: StreakFreezeBadgeProps) {
  const isActive = freezesAvailable === 1;

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${
          isActive
            ? "border-mint/30 bg-mint/10 text-mint"
            : "border-fog/20 bg-fog/10 text-storm"
        }`}
        aria-label={
          isActive
            ? "Protección de racha activa"
            : `Protección usada${lastFreezeUsed ? ` el ${lastFreezeUsed}` : ""} — recarga lunes`
        }
        title={
          isActive ? "Protección activa — cubre 1 día de ausencia" : "Protección usada — recarga lunes 00:00 UTC"
        }
      >
        {isActive ? (
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <ShieldOff className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        <span aria-hidden="true">{isActive ? "Protección" : "Sin protección"}</span>
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium ${
        isActive
          ? "border-mint/30 bg-mint/10 text-mint"
          : "border-fog/20 bg-fog/10 text-storm"
      }`}
      aria-label={
        isActive
          ? "Protección de racha activa: cubre 1 día de ausencia sin perder racha"
          : `Protección usada${lastFreezeUsed ? ` el ${lastFreezeUsed}` : ""} — recarga lunes 00:00 UTC`
      }
      role="status"
    >
      {isActive ? (
        <Shield className="h-4 w-4" aria-hidden="true" />
      ) : (
        <ShieldOff className="h-4 w-4" aria-hidden="true" />
      )}
      <span>{isActive ? "Protección activa" : "Protección usada — recarga lunes"}</span>
    </div>
  );
}
