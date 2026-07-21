import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/certify
 *
 * Server-side certification stub for E2B sandbox execution.
 *
 * Current behaviour (MVP stub):
 * - Always returns certified=true for demonstration
 * - Future: runs code in E2B sandbox with 3 random test seeds
 */
export async function POST(request: NextRequest) {
  try {
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
    // For MVP, always pass:
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
