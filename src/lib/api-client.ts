import { auth } from "@clerk/nextjs/server";
import { apiFetchWithToken } from "./api-client-shared";

/**
 * Server-side fetch wrapper that adds Clerk JWT as Bearer token
 * and points to the FastAPI backend.
 *
 * Use this in Server Components, Server Actions, and Route Handlers.
 * For client-side calls, use `useApiClient()` hook instead.
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const session = await auth();
  return apiFetchWithToken<T>(path, () => session.getToken(), options);
}
