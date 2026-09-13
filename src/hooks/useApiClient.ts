"use client";

import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";
import { apiFetchWithToken } from "@/lib/api-client-shared";

/**
 * Client-side hook that provides an authenticated fetch function
 * pointing to the FastAPI backend.
 *
 * Usage:
 *   const { apiClient } = useApiClient();
 *   const data = await apiClient("/api/v1/progress", { method: "POST", body: "..." });
 */
export function useApiClient() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const apiClient = useMemo(() => {
    return <T = unknown>(path: string, options: RequestInit = {}) =>
      apiFetchWithToken<T>(path, getToken, options);
  }, [getToken]);

  return {
    apiClient,
    isLoaded,
    isSignedIn,
  };
}
