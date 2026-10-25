"use client";

import { createContext, useContext, useCallback, useEffect, useState, type ReactNode } from "react";

type AvatarData = {
  username: string | null;
  email: string | null;
  avatarUrl: string | null;
};

type AvatarContextValue = AvatarData & {
  isLoading: boolean;
  refresh: () => Promise<void>;
  setAvatarUrl: (url: string | null) => void;
};

const AvatarContext = createContext<AvatarContextValue>({
  username: null,
  email: null,
  avatarUrl: null,
  isLoading: true,
  refresh: async () => {},
  setAvatarUrl: () => {},
});

export function AvatarProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AvatarData>({ username: null, email: null, avatarUrl: null });
  const [isLoading, setIsLoading] = useState(true);

  const fetchAvatar = useCallback(async () => {
    try {
      const res = await fetch("/api/me", { cache: "no-store" });
      if (!res.ok) throw new Error("not ok");
      const json = await res.json();
      setData({
        username: json.username ?? null,
        email: json.email ?? null,
        avatarUrl: json.avatar_url ?? null,
      });
    } catch {
      // keep null, fallback to initials
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAvatar();
    // Listen for avatar updates from other windows/tabs
    const onStorage = (e: StorageEvent) => {
      if (e.key === "avatar_updated") fetchAvatar();
    };
    window.addEventListener("storage", onStorage);
    // Custom event for same-window updates
    const onCustom = () => fetchAvatar();
    window.addEventListener("avatar_updated", onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("avatar_updated", onCustom);
    };
  }, [fetchAvatar]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    await fetchAvatar();
  }, [fetchAvatar]);

  const setAvatarUrl = useCallback((url: string | null) => {
    setData((prev) => ({ ...prev, avatarUrl: url }));
    // Broadcast to other windows
    try {
      localStorage.setItem("avatar_updated", Date.now().toString());
      window.dispatchEvent(new Event("avatar_updated"));
    } catch {}
  }, []);

  return (
    <AvatarContext.Provider value={{ ...data, isLoading, refresh, setAvatarUrl }}>
      {children}
    </AvatarContext.Provider>
  );
}

export function useAvatar() {
  return useContext(AvatarContext);
}

export function useUserAvatar() {
  return useContext(AvatarContext);
}
