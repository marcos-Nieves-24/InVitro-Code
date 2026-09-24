"use client";

type Props = {
  percent: number;
  shouldReduce: boolean;
};

export function BioreactorVessel({ percent, shouldReduce }: Props) {
  return (
    <div
      className="relative flex h-[220px] w-[160px] shrink-0 flex-col overflow-hidden rounded-[14px] border border-surface-raised bg-surface-card/70 backdrop-blur-sm"
      style={{ boxShadow: "var(--shadow-sm)" }}
    >
      {/* Tapa metálica */}
      <div className="h-3 shrink-0 rounded-t-[12px] border-b border-slate bg-graphite" />
      {/* Highlight especular lateral */}
      <div className="pointer-events-none absolute inset-y-3 left-0 w-[18%] rounded-l-[14px] bg-gradient-to-br from-white/40 to-transparent" />
      {/* Vessel body */}
      <div className="relative flex flex-1 flex-col justify-end overflow-hidden">
        {/* Líquido */}
        <div
          className="absolute bottom-0 w-full bg-gradient-to-t from-fog to-mint"
          style={{
            height: `${Math.max(4, percent)}%`,
            transition: shouldReduce ? "none" : "height 600ms var(--ease-out)",
            willChange: shouldReduce ? "auto" : "height",
          }}
        >
          {/* Menisco superficie */}
          <div className="absolute -top-[3px] left-0 h-[6px] w-full rounded-full bg-white/35 blur-[0.5px]" />
        </div>
        {/* Borde glow interno */}
        <div className="pointer-events-none absolute inset-0 rounded-b-[14px] shadow-glow" />
      </div>
    </div>
  );
}
