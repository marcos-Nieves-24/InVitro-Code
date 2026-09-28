import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { NextRequest } from "next/server";

// `NextRequest` is a type-only use, so only `NextResponse` needs a runtime stub.
vi.mock("next/server", () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) =>
      new Response(JSON.stringify(body), {
        status: init?.status ?? 200,
        headers: { "content-type": "application/json" },
      }),
  },
}));

vi.mock("@clerk/nextjs/server", () => ({ auth: vi.fn() }));
vi.mock("@/lib/supabase/admin", () => ({ createAdminClient: vi.fn() }));
vi.mock("@/lib/gamification/utils", () => ({ calcXpForLesson: vi.fn(() => 20) }));
vi.mock("@/lib/gamification/achievements", () => ({
  evaluateAchievements: vi.fn(async () => ({ achievements: [], summary: {} })),
}));
vi.mock("@/lib/content/modules", () => ({
  getLessonSlugs: vi.fn(() => ["lesson01_foo", "lesson02_bar"]),
}));

import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { calcXpForLesson } from "@/lib/gamification/utils";
import { evaluateAchievements } from "@/lib/gamification/achievements";
import { getLessonSlugs } from "@/lib/content/modules";
import { POST } from "./route";

type LooseMock = ReturnType<typeof vi.fn>;
const mockAuth = auth as unknown as LooseMock;
const mockCreateAdmin = createAdminClient as unknown as LooseMock;
const mockCalcXp = calcXpForLesson as unknown as LooseMock;
const mockEvaluate = evaluateAchievements as unknown as LooseMock;
const mockGetLessonSlugs = getLessonSlugs as unknown as LooseMock;

type Result = { data: unknown; error: { message: string } | null };
type UpsertCall = { table: string; payload: Record<string, unknown>; onConflict?: string };
type StreakRow = { current_streak: number; longest_streak: number; last_active_date: string };

let upserts: UpsertCall[] = [];
let streakRow: StreakRow | null = null;
let singleOverrides: Record<string, Result> = {};

/** Chainable stand-in for the two query shapes the route actually issues. */
function makeClient() {
  return {
    from(table: string) {
      let lastPayload: Record<string, unknown> | null = null;
      const builder = {
        select: () => builder,
        upsert: (payload: Record<string, unknown>, opts?: { onConflict?: string }) => {
          lastPayload = payload;
          upserts.push({ table, payload, onConflict: opts?.onConflict });
          return builder;
        },
        eq: () => builder,
        single: async (): Promise<Result> =>
          singleOverrides[table] ?? { data: lastPayload ?? {}, error: null },
        maybeSingle: async (): Promise<Result> => ({ data: streakRow, error: null }),
      };
      return builder;
    },
  };
}

const upsertsFor = (table: string) => upserts.filter((u) => u.table === table);
const payloadFor = (table: string) => upsertsFor(table)[0].payload;

/** Mirrors the route's UTC day-granular clock so fixtures stay time-independent. */
function utcDay(offset = 0): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offset);
  return d.toISOString().slice(0, 10);
}

const request = (body: unknown) => ({ json: async () => body }) as unknown as NextRequest;
const brokenRequest = () =>
  ({ json: async () => { throw new SyntaxError("Unexpected token <"); } }) as unknown as NextRequest;
const valid = { module_slug: "python", lesson_slug: "lesson01_foo" };

let consoleError: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  upserts = [];
  streakRow = null;
  singleOverrides = {};
  vi.resetAllMocks();
  mockAuth.mockResolvedValue({ userId: "user_1" });
  mockCalcXp.mockReturnValue(20);
  mockEvaluate.mockResolvedValue({ achievements: [], summary: {} });
  mockGetLessonSlugs.mockReturnValue(["lesson01_foo", "lesson02_bar"]);
  mockCreateAdmin.mockImplementation(() => makeClient());

  consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => consoleError.mockRestore());

describe("POST /api/progress", () => {
  it("401 without a session and never opens a database client", async () => {
    mockAuth.mockResolvedValue({ userId: null });
    const res = await POST(request(valid));
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Unauthorized" });
    expect(mockCreateAdmin).not.toHaveBeenCalled();
  });

  it("400 when the body is not valid JSON", async () => {
    const res = await POST(brokenRequest());
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Invalid request body" });
  });

  it("400 when the parsed body is null or an array", async () => {
    for (const body of [null, [valid]]) {
      const res = await POST(request(body));
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ error: "Invalid request body" });
    }
  });

  it("400 when module_slug is blank", async () => {
    const res = await POST(request({ ...valid, module_slug: "   " }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Invalid module/lesson" });
    expect(mockCreateAdmin).not.toHaveBeenCalled();
  });

  it("400 when lesson_slug is blank or not a string", async () => {
    for (const lesson_slug of ["  ", 42, null]) {
      const res = await POST(request({ ...valid, lesson_slug }));
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ error: "Invalid module/lesson" });
    }
  });

  it("400 for an unknown module with an empty catalog", async () => {
    mockGetLessonSlugs.mockReturnValue([]);
    const res = await POST(request(valid));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Unknown module/lesson" });
  });

  it("400 when the lesson is absent from a non-empty catalog", async () => {
    const res = await POST(request({ ...valid, lesson_slug: "lesson99_bogus" }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Unknown module/lesson" });
  });

  it("200 upserts progress with server-derived identity and trimmed slugs", async () => {
    const res = await POST(request({ module_slug: "  python  ", lesson_slug: " lesson01_foo " }));
    expect(res.status).toBe(200);
    const call = upsertsFor("progress")[0];
    expect(call.onConflict).toBe("user_id,module_slug,lesson_slug");
    expect(call.payload).toMatchObject({
      user_id: "user_1",
      module_slug: "python",
      lesson_slug: "lesson01_foo",
      completed: true,
    });
    expect(await res.json()).toHaveProperty("progress");
  });

  // `calcXpForLesson` is stubbed to a serverXp of 20 for every test.
  it("caps client-requested XP at the server-authoritative value", async () => {
    const res = await POST(request({ ...valid, xp_earned: 999999 }));
    expect(res.status).toBe(200);
    expect(payloadFor("progress").xp_earned).toBe(20);
  });

  it("honours a client request for LESS XP than the server allows", async () => {
    const res = await POST(request({ ...valid, xp_earned: 5 }));
    expect(res.status).toBe(200);
    expect(payloadFor("progress").xp_earned).toBe(5);
  });

  it("does not advance the streak when last_active_date is today", async () => {
    streakRow = { current_streak: 5, longest_streak: 7, last_active_date: utcDay() };
    const res = await POST(request(valid));
    expect(res.status).toBe(200);
    expect(payloadFor("streaks")).toMatchObject({
      current_streak: 5,
      longest_streak: 7,
      last_active_date: utcDay(),
    });
  });

  it("increments the streak when last_active_date is yesterday", async () => {
    streakRow = { current_streak: 3, longest_streak: 3, last_active_date: utcDay(-1) };
    const res = await POST(request(valid));
    expect(res.status).toBe(200);
    expect(payloadFor("streaks")).toMatchObject({
      current_streak: 4,
      longest_streak: 4,
      last_active_date: utcDay(),
    });
  });

  it("does not advance the streak when completed is false", async () => {
    streakRow = { current_streak: 3, longest_streak: 9, last_active_date: utcDay(-1) };
    const res = await POST(request({ ...valid, completed: false }));
    expect(res.status).toBe(200);
    expect(payloadFor("streaks")).toMatchObject({
      current_streak: 3,
      longest_streak: 9,
      last_active_date: utcDay(-1),
    });
  });

  it("returns 200 (not 500) when evaluateAchievements throws", async () => {
    mockEvaluate.mockRejectedValue(new Error("achievement store down"));
    const res = await POST(request(valid));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.progress).toBeDefined();
    expect(body.achievements).toEqual([]);
    expect(consoleError).toHaveBeenCalled();
  });

  it("returns 200 (not 500) when the streak write fails", async () => {
    singleOverrides.streaks = { data: null, error: { message: "streak boom" } };
    const res = await POST(request(valid));
    expect(res.status).toBe(200);
    expect((await res.json()).progress).toBeDefined();
    expect(consoleError).toHaveBeenCalled();
  });

  it("returns 500 with the database message when the progress write fails", async () => {
    singleOverrides.progress = { data: null, error: { message: "duplicate key" } };
    const res = await POST(request(valid));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "duplicate key" });
  });

  it("is idempotent when the same payload is replayed on the same UTC day", async () => {
    streakRow = { current_streak: 4, longest_streak: 4, last_active_date: utcDay() };
    const first = await POST(request(valid));
    const second = await POST(request(valid));
    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    const streakWrites = upsertsFor("streaks");
    expect(streakWrites).toHaveLength(2);
    expect(streakWrites[0].payload.current_streak).toBe(4);
    expect(streakWrites[1].payload.current_streak).toBe(4);
  });
});
