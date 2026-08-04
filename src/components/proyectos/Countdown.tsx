"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  days: number;
  hours: number;
  minutes: number;
}

export function Countdown({ days, hours, minutes }: CountdownProps) {
  const [target] = useState(
    () => Date.now() + ((days * 86400 + hours * 3600 + minutes * 60) * 1000),
  );
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, target - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor(diff / 3600000) % 24;
  const m = Math.floor(diff / 60000) % 60;
  const s = Math.floor(diff / 1000) % 60;

  const boxes: Array<[string, number]> = [
    ["Días", d],
    ["Hrs", h],
    ["Min", m],
    ["Seg", s],
  ];

  return (
    <div className="flex gap-2">
      {boxes.map(([label, value]) => (
        <div
          key={label}
          className="flex flex-col items-center rounded-lg bg-deep-navy px-3 py-1 text-white"
        >
          <span className="text-lg font-bold leading-none">
            {String(value).padStart(2, "0")}
          </span>
          <span className="text-[8px] uppercase tracking-tighter opacity-70">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}