import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const hasSecret = !!process.env.BENCH_SECRET;
  const secretLen = process.env.BENCH_SECRET?.length ?? 0;
  return NextResponse.json({ hasSecret, secretLen, hasBenchUser: false });
}

export async function POST(request: Request) {
  const hasSecret = !!process.env.BENCH_SECRET;
  const secretLen = process.env.BENCH_SECRET?.length ?? 0;
  const headerSecret = request.headers.get("x-bench-secret");
  const headerUser = request.headers.get("x-bench-user-id");
  const match = hasSecret && headerSecret === process.env.BENCH_SECRET;
  return NextResponse.json({ hasSecret, secretLen, headerSecretLen: headerSecret?.length ?? 0, headerUser, match });
}
