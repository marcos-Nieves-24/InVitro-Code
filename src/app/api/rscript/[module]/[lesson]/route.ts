import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import fs from "fs";
import path from "path";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ module: string; lesson: string }> },
) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { module: modSlug, lesson: lessonSlug } = await params;

  const contentRoot = path.resolve(process.cwd(), "src/content/modules");
  const resolved = path.resolve(
    contentRoot,
    modSlug,
    "lessons",
    lessonSlug,
    "lab.R",
  );

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

  if (!fs.existsSync(resolved)) {
    return new NextResponse(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const content = fs.readFileSync(resolved, "utf8");

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": 'attachment; filename="lab.R"',
    },
  });
}
