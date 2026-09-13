const FASTAPI_URL = process.env.NEXT_PUBLIC_FASTAPI_URL;

function getFastApiUrl(): string {
  if (!FASTAPI_URL) {
    throw new Error(
      "Missing NEXT_PUBLIC_FASTAPI_URL environment variable. " +
        "Set it to your FastAPI backend URL (e.g. http://localhost:8000).",
    );
  }
  return FASTAPI_URL;
}

/**
 * Shared fetch logic — works on both server and client.
 * Accepts a token getter function so the caller controls auth.
 */
export async function apiFetchWithToken<T = unknown>(
  path: string,
  getToken: () => Promise<string | null>,
  options: RequestInit = {},
): Promise<T> {
  const token = await getToken();

  if (!token) {
    throw new Error(
      "No authentication token available. User may not be signed in.",
    );
  }

  const url = `${getFastApiUrl()}${path}`;

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
