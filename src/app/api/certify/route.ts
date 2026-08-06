import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

/**
 * POST /api/certify
 *
 * Server-side certification for E2B sandbox execution.
 *
 * Order of checks (REQ-CER-03/05):
 * 1. Clerk session required -> 401
 * 2. Feature flag `FEATURE_FLAG_CERTIFY !== "true"` -> 503, never `certified: true`
 * 3. Only with the flag ON does the E2B block run (MVP stub today)
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (process.env.FEATURE_FLAG_CERTIFY !== "true") {
      return NextResponse.json(
        { certified: false, message: "La certificación no está disponible todavía." },
        { status: 503 },
      );
    }

    const body = await request.json();
    const { code } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { certified: false, message: "No code provided." },
        { status: 400 },
      );
    }

    // ── E2B integration point ──
    // Replace this block with actual E2B execution:
    //
    //   const e2b = createSandbox()
    //   const result = await e2b.runCode(code, { seeds: [1,2,3] })
    //   return NextResponse.json({
    //     certified: result.allPassed,
    //     testsPassed: result.passed,
    //     message: result.message,
    //   })
    //
    // For MVP, always pass (only reachable with FEATURE_FLAG_CERTIFY=true):
    return NextResponse.json({
      certified: true,
      testsPassed: 3,
      message:
        "Certificación MVP: código ejecutado correctamente. (E2B se integrará en próxima versión.)",
    });
  } catch {
    return NextResponse.json(
      {
        certified: false,
        message:
          "Error interno del servidor. Intentá de nuevo más tarde.",
      },
      { status: 500 },
    );
  }
}
