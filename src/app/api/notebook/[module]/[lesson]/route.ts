import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import fs from "fs";
import path from "path";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ module: string; lesson: string }> },
) {
  // REQ-NBAPI-01: Clerk auth gate
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { module: modSlug, lesson: lessonSlug } = await params;

  // REQ-NBAPI-05: Reject path traversal — normalize and verify the resolved
  // path stays within src/content/modules.
  const contentRoot = path.resolve(process.cwd(), "src/content/modules");
  const resolved = path.resolve(
    contentRoot,
    modSlug,
    "lessons",
    lessonSlug,
    "notebook.ipynb",
  );

  // Must start with contentRoot and contain no .. escape remnants
  if (
    !resolved.startsWith(contentRoot) ||
    resolved.includes("..") ||
    path.normalize(resolved) !== resolved
  ) {
    return new NextResponse(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // REQ-NBAPI-03: File must exist
  if (!fs.existsSync(resolved)) {
    return new NextResponse(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // REQ-NBAPI-02 + REQ-NBAPI-04: Serve raw bytes, preserve outputs
  const bytes = fs.readFileSync(resolved);

  return new NextResponse(bytes, {
    status: 200,
    headers: {
      "Content-Type": "application/x-ipynb+json",
      "Content-Disposition": 'attachment; filename="notebook.ipynb"',
      "Content-Length": String(bytes.length),
    },
  });
}
