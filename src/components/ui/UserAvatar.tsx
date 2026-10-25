"use client";

import { useState } from "react";

type Size = "sm" | "md" | "lg" | "xl";
const sizeClasses: Record<Size, string> = {
  sm: "h-8 w-8 text-[10px]",
  md: "h-10 w-10 text-xs",
  lg: "h-12 w-12 text-sm",
  xl: "h-32 w-32 text-3xl md:h-[140px] md:w-[140px] md:text-4xl",
};

interface UserAvatarProps {
  username?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  size?: Size;
  className?: string;
}

function getInitials(username?: string | null, email?: string | null) {
  const base = username || email?.split("@")[0] || "Usuario";
  return base
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";
}

export function UserAvatar({ username, email, avatarUrl, size = "md", className = "" }: UserAvatarProps) {
  const [error, setError] = useState(false);
  const initials = getInitials(username, email);
  const showImage = !!avatarUrl && !error;

  if (showImage) {
    return (
      <img
        src={avatarUrl!}
        alt={username ?? email ?? "Usuario"}
        className={`${sizeClasses[size]} shrink-0 rounded-full object-cover ${className}`}
        onError={() => setError(true)}
        loading="lazy"
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} flex shrink-0 items-center justify-center rounded-full bg-fog font-bold text-ink ${className}`}
      aria-label={username ?? "Usuario"}
    >
      {initials}
    </div>
  );
}

export function UserAvatarPlaceholder({ size = "md", className = "" }: { size?: Size; className?: string }) {
  return (
    <div className={`${sizeClasses[size]} shrink-0 animate-pulse rounded-full bg-surface-raised ${className}`} aria-hidden="true" />
  );
}
