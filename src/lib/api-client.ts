import { auth } from "@clerk/nextjs/server";

const FASTAPI_URL = process.env.NEXT_PUBLIC_FASTAPI_URL;

/**
 * Server-side fetch wrapper that adds Clerk JWT as Bearer token
 * and points to the FastAPI backend.
 *
 * Use this in Server Components, Server Actions, and Route Handlers.
 * For client-side calls, create a separate hook that uses `useAuth().getToken()`.
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  if (!FASTAPI_URL) {
    throw new Error(
      "Missing NEXT_PUBLIC_FASTAPI_URL environment variable. " +
        "Set it to your FastAPI backend URL (e.g. http://localhost:8000).",
    );
  }

  const session = await auth();
  const token = await session.getToken();

  if (!token) {
    throw new Error("No authentication token available. User may not be signed in.");
  }

  const url = `${FASTAPI_URL}${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `FastAPI error ${response.status} on ${path}: ${body || response.statusText}`,
    );
  }

  return response.json() as Promise<T>;
}
