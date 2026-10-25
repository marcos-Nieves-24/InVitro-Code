"use client";

import { useState, useEffect } from "react";

interface FollowButtonProps {
  targetUserId: string;
  initialIsFollowing?: boolean;
  onToggle?: (isFollowing: boolean) => void;
}

export function FollowButton({ targetUserId, initialIsFollowing = false, onToggle }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsFollowing(initialIsFollowing);
    // Fetch real status
    fetch(`/api/follow?targetId=${targetUserId}`)
      .then((r) => r.json())
      .then((data) => {
        if (typeof data.isFollowing === "boolean") setIsFollowing(data.isFollowing);
      })
      .catch(() => {});
  }, [targetUserId, initialIsFollowing]);

  const handleToggle = async () => {
    setLoading(true);
    const action = isFollowing ? "unfollow" : "follow";
    try {
      const res = await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followingId: targetUserId, action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      const next = !isFollowing;
      setIsFollowing(next);
      onToggle?.(next);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al seguir");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      className={`rounded-btn px-4 py-1.5 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint disabled:opacity-50 ${
        isFollowing
          ? "border border-surface-raised bg-surface text-ink hover:bg-surface-card"
          : "bg-mint text-ink hover:bg-fog"
      }`}
    >
      {loading ? "..." : isFollowing ? "Siguiendo" : "Seguir"}
    </button>
  );
}
