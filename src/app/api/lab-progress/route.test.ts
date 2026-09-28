import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mocks must be hoisted before imports that use them
const mockAuth = vi.fn();
vi.mock("@clerk/nextjs/server", () => ({
  auth: () => mockAuth(),
}));

// In-memory lab_progress store
type Row = {
  user_id: string;
  module_slug: string;
  lesson_slug: string;
  completion_status: string;
  completion_date: string | null;
  last_position: Record<string, unknown>;
  updated_at: string;
};
let store: Row[] = [];
let adminCallCount = 0;

function makeSupabaseMock() {
  return {
    from: (table: string) => {
      if (table === "lab_progress") {
        const chain: Record<string, unknown> = {};
        let filtered: Row[] = [...store];
        let selectCols: string | null = null;
        let isSingle = false;
        let isMaybeSingle = false;
        const api: Record<string, unknown> = {
          select: (cols: string) => {
            selectCols = cols;
            return api;
          },
          eq: (col: string, val: string) => {
            filtered = filtered.filter((r) => (r as Record<string, unknown>)[col] === val);
            return api;
          },
          maybeSingle: () => {
            isMaybeSingle = true;
            const row = filtered[0] ?? null;
            // Simulate supabase shape
            if (!row) return Promise.resolve({ data: null, error: null });
            // Return only requested cols
            return Promise.resolve({ data: row, error: null });
          },
          single: () => {
            isSingle = true;
            const row = filtered[0] ?? null;
            if (!row) return Promise.resolve({ data: null, error: { message: "No rows" } });
            return Promise.resolve({ data: row, error: null });
          },
          upsert: (payload: Row, opts: { onConflict: string }) => {
            // Find existing by PK
            const idx = store.findIndex(
              (r) =>
                r.user_id === payload.user_id &&
                r.module_slug === payload.module_slug &&
                r.lesson_slug === payload.lesson_slug,
            );
            if (idx >= 0) store[idx] = { ...payload };
            else store.push({ ...payload });
            // Return chain with select().single()
            const upsertChain: Record<string, unknown> = {
              select: () => upsertChain,
              single: () => {
                const found = store.find(
                  (r) =>
                    r.user_id === payload.user_id &&
                    r.module_slug === payload.module_slug &&
                    r.lesson_slug === payload.lesson_slug,
                );
                return Promise.resolve({ data: found ?? null, error: null });
              },
            };
            return upsertChain;
          },
          // For GET .from().select().eq().eq() -> then await query resolves to {data, error}
          then: undefined,
        };
        // Make chain thenable for GET query (await query)
        // Vitest/supabase pattern: await query returns {data, error}
        // We achieve by making api awaitable via Promise
        const thenable = new Promise<{ data: Row[] | null; error: null }>((resolve) => {
          // Defer resolution until after eq chaining — need to monkey-patch
          // Instead we override later: simplest is to make eq return thenable promise for GET
          // We'll handle GET differently below via custom mock for GET case
        });
        // For simplicity, handle GET via explicit then override in GET mock path:
        // We'll make the mock .then for GET queries: if not upsert/maybeSingle/single, it's a list fetch
        // Patch api to be thenable for list fetch
        (api as unknown as { then: unknown }).then = (onFulfilled: unknown, onRejected: unknown) => {
          // filtered already computed via eq calls; return filtered rows projected
          const rows = filtered.map((r) => ({
            module_slug: r.module_slug,
            lesson_slug: r.lesson_slug,
            completion_status: r.completion_status,
            completion_date: r.completion_date,
            last_position: r.last_position,
            updated_at: r.updated_at,
          }));
          return Promise.resolve({ data: rows, error: null }).then(
            onFulfilled as never,
            onRejected as never,
          );
        };

        // Also handle select().eq() chaining returns same api
        return api as unknown as never;
      }
      if (table === "progress") {
        return {
          upsert: () => Promise.resolve({ error: null }),
        } as unknown as never;
      }
      return {
        select: () => ({ eq: () => ({ maybeSingle: () => Promise.resolve({ data: null, error: null }) }) }),
        upsert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
      } as unknown as never;
    },
  };
}

const mockCreateAdminClient = vi.fn(() => makeSupabaseMock());
vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => mockCreateAdminClient(),
}));

// Mock getLessonSlugs to controlled list for tests
vi.mock("@/lib/content/modules", async () => {
  const actual = await vi.importActual<typeof import("@/lib/content/modules")>("@/lib/content/modules");
  return {
    ...actual,
    getLessonSlugs: (mod: string) => {
      if (mod === "python") return ["lesson01_installing_python", "lesson02_jupyter_notebook", "lesson03_variables"];
      if (mod === "ia") return ["lesson01_what_is_ai", "lesson02_how_ai_learns"];
      return [];
    },
  };
});

vi.mock("@/lib/gamification/utils", () => ({
  calcXpForLesson: () => 25,
}));

import { GET, POST } from "./route";

function req(url: string, init?: RequestInit) {
  return new NextRequest(new URL(url, "http://localhost"), init as unknown as never);
}

describe("GET /api/lab-progress", () => {
  beforeEach(() => {
    store = [];
    mockAuth.mockReset();
    mockCreateAdminClient.mockClear();
    adminCallCount = 0;
  });

  it("401 without session", async () => {
    mockAuth.mockResolvedValue({ userId: null });
    const res = await GET(req("/api/lab-progress?module=python"));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("Unauthorized");
  });

  it("200 returns rows filtered by module, unknown module → []", async () => {
    mockAuth.mockResolvedValue({ userId: "user_a" });
    store = [
      {
        user_id: "user_a",
        module_slug: "python",
        lesson_slug: "lesson01_installing_python",
        completion_status: "completed",
        completion_date: new Date().toISOString(),
        last_position: {},
        updated_at: new Date().toISOString(),
      },
      {
        user_id: "user_a",
        module_slug: "ia",
        lesson_slug: "lesson01_what_is_ai",
        completion_status: "in_progress",
        completion_date: null,
        last_position: { activeTab: "lab" },
        updated_at: new Date().toISOString(),
      },
    ];
    const res = await GET(req("/api/lab-progress?module=python"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toHaveLength(1);
    expect(body.data[0].module_slug).toBe("python");

    const res2 = await GET(req("/api/lab-progress?module=no_existe"));
    expect(res2.status).toBe(200);
    expect((await res2.json()).data).toEqual([]);
  });

  it("200 without ?module returns all modules", async () => {
    mockAuth.mockResolvedValue({ userId: "user_a" });
    store = [
      {
        user_id: "user_a",
        module_slug: "python",
        lesson_slug: "lesson01_installing_python",
        completion_status: "completed",
        completion_date: new Date().toISOString(),
        last_position: {},
        updated_at: new Date().toISOString(),
      },
      {
        user_id: "user_a",
        module_slug: "ia",
        lesson_slug: "lesson01_what_is_ai",
        completion_status: "completed",
        completion_date: new Date().toISOString(),
        last_position: {},
        updated_at: new Date().toISOString(),
      },
    ];
    const res = await GET(req("/api/lab-progress"));
    expect(res.status).toBe(200);
    expect((await res.json()).data).toHaveLength(2);
  });
});

describe("POST /api/lab-progress", () => {
  beforeEach(() => {
    store = [];
    mockAuth.mockReset();
    mockCreateAdminClient.mockClear();
  });

  it("401 without session", async () => {
    mockAuth.mockResolvedValue({ userId: null });
    const r = req("/api/lab-progress", {
      method: "POST",
      body: JSON.stringify({ module_slug: "python", lesson_slug: "lesson01_installing_python" }),
    });
    const res = await POST(r);
    expect(res.status).toBe(401);
  });

  it("400 invalid slug", async () => {
    mockAuth.mockResolvedValue({ userId: "user_a" });
    const r = req("/api/lab-progress", {
      method: "POST",
      body: JSON.stringify({ module_slug: "python", lesson_slug: "lesson99_fake" }),
    });
    const res = await POST(r);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/Invalid module\/lesson/);
  });

  it("400 invalid last_position shape", async () => {
    mockAuth.mockResolvedValue({ userId: "user_a" });
    const r = req("/api/lab-progress", {
      method: "POST",
      body: JSON.stringify({
        module_slug: "python",
        lesson_slug: "lesson01_installing_python",
        last_position: "not-an-object",
      }),
    });
    const res = await POST(r);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("Invalid last_position");
  });

  it("POST in_progress creates row and is idempotent, ignores user_id from body", async () => {
    mockAuth.mockResolvedValue({ userId: "user_a" });
    const r1 = req("/api/lab-progress", {
      method: "POST",
      body: JSON.stringify({
        user_id: "victima",
        module_slug: "python",
        lesson_slug: "lesson01_installing_python",
        completion_status: "in_progress",
        last_position: { activeTab: "lab" },
      }),
    });
    const res1 = await POST(r1);
    expect(res1.status).toBe(200);
    expect(mockCreateAdminClient).toHaveBeenCalled();
    const body1 = await res1.json();
    expect(body1.data.completion_status).toBe("in_progress");
    // store must have user_a, not victima
    expect(store[0]?.user_id).toBe("user_a");
    expect(store).toHaveLength(1);

    // Re-POST same with different last_position → upsert, still 1 row
    const r2 = req("/api/lab-progress", {
      method: "POST",
      body: JSON.stringify({
        module_slug: "python",
        lesson_slug: "lesson01_installing_python",
        completion_status: "in_progress",
        last_position: { activeTab: "quiz" },
      }),
    });
    const res2 = await POST(r2);
    expect(res2.status).toBe(200);
    expect(store).toHaveLength(1);
    expect((store[0]?.last_position as Record<string, unknown>).activeTab).toBe("quiz");
  });

  it("POST completed fixes completion_date then re-POST preserves original date", async () => {
    mockAuth.mockResolvedValue({ userId: "user_a" });
    const r1 = req("/api/lab-progress", {
      method: "POST",
      body: JSON.stringify({
        module_slug: "python",
        lesson_slug: "lesson01_installing_python",
        completion_status: "completed",
      }),
    });
    const res1 = await POST(r1);
    expect(res1.status).toBe(200);
    const date1 = (await res1.json()).data.completion_date as string;
    expect(date1).toBeTruthy();

    // Small delay then re-POST
    await new Promise((r) => setTimeout(r, 5));
    const r2 = req("/api/lab-progress", {
      method: "POST",
      body: JSON.stringify({
        module_slug: "python",
        lesson_slug: "lesson01_installing_python",
        completion_status: "completed",
      }),
    });
    const res2 = await POST(r2);
    const date2 = (await res2.json()).data.completion_date as string;
    expect(date2).toBe(date1);
  });

  it("downgrade blocked: completed → in_progress keeps completed", async () => {
    mockAuth.mockResolvedValue({ userId: "user_a" });
    // First complete
    const rComplete = req("/api/lab-progress", {
      method: "POST",
      body: JSON.stringify({
        module_slug: "python",
        lesson_slug: "lesson01_installing_python",
        completion_status: "completed",
      }),
    });
    const resC = await POST(rComplete);
    const dateCompleted = (await resC.json()).data.completion_date as string;
    expect(dateCompleted).toBeTruthy();

    // Attempt downgrade to in_progress
    const rDowngrade = req("/api/lab-progress", {
      method: "POST",
      body: JSON.stringify({
        module_slug: "python",
        lesson_slug: "lesson01_installing_python",
        completion_status: "in_progress",
      }),
    });
    const resD = await POST(rDowngrade);
    expect(resD.status).toBe(200);
    const bodyD = await resD.json();
    expect(bodyD.data.completion_status).toBe("completed");
    expect(bodyD.data.completion_date).toBe(dateCompleted);
    // Store still completed
    expect(store[0]?.completion_status).toBe("completed");
  });

  it("downgrade blocked: completed → not_started keeps completed", async () => {
    mockAuth.mockResolvedValue({ userId: "user_a" });
    // Ensure store has completed row
    store = [
      {
        user_id: "user_a",
        module_slug: "python",
        lesson_slug: "lesson02_jupyter_notebook",
        completion_status: "completed",
        completion_date: "2026-09-20T10:00:00.000Z",
        last_position: {},
        updated_at: new Date().toISOString(),
      },
    ];
    const r = req("/api/lab-progress", {
      method: "POST",
      body: JSON.stringify({
        module_slug: "python",
        lesson_slug: "lesson02_jupyter_notebook",
        completion_status: "not_started",
      }),
    });
    const res = await POST(r);
    expect(res.status).toBe(200);
    expect((await res.json()).data.completion_status).toBe("completed");
  });

  it("uses createAdminClient (service-role) for writes, never anon key", async () => {
    mockAuth.mockResolvedValue({ userId: "user_a" });
    const r = req("/api/lab-progress", {
      method: "POST",
      body: JSON.stringify({
        module_slug: "python",
        lesson_slug: "lesson01_installing_python",
        completion_status: "in_progress",
      }),
    });
    await POST(r);
    expect(mockCreateAdminClient).toHaveBeenCalled();
  });
});
