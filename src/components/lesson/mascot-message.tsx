interface MascotMessageProps {
  children: React.ReactNode;
  side?: "left" | "right";
  mood?: "neutral" | "thinking" | "celebrating";
}

function ConiAvatar({ mood }: { mood: "neutral" | "thinking" | "celebrating" }) {
  const pupilCy = mood === "thinking" ? "16" : "18";

  return (
    <svg
      viewBox="0 0 40 40"
      width="36"
      height="36"
      className="shrink-0"
      aria-label="Coni la conidia"
    >
      {/* halo exterior */}
      <ellipse cx="20" cy="22" rx="14" ry="16" fill="#3B82F6" opacity="0.08" />
      {/* cuerpo */}
      <circle cx="20" cy="20" r="10" fill="#3B82F6" />
      {/* ojos (blanco) */}
      <circle cx="16" cy="18" r="2.5" fill="white" />
      <circle cx="24" cy="18" r="2.5" fill="white" />
      {/* pupilas */}
      <circle cx="16" cy={pupilCy} r="1.2" fill="#1E3A5F" />
      <circle cx="24" cy={pupilCy} r="1.2" fill="#1E3A5F" />
      {/* sonrisa (solo celebrating) */}
      {mood === "celebrating" && (
        <path
          d="M 16 23 Q 20 26 24 23"
          fill="none"
          stroke="#1E3A5F"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export function MascotMessage({
  children,
  side = "left",
  mood = "neutral",
}: MascotMessageProps) {
  const avatar = <ConiAvatar mood={mood} />;

  return (
    <div
      className={`my-6 flex items-start gap-3 ${
        side === "right" ? "flex-row-reverse" : ""
      }`}
    >
      {avatar}
      <div className="min-w-0 rounded-[12px] border border-gray-200 bg-white px-4 py-3 text-sm leading-relaxed text-gray-700 shadow-sm">
        {children}
      </div>
    </div>
  );
}
