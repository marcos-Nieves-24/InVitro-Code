import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const module = searchParams.get("module") || "ia";
  const slug = searchParams.get("slug") || "lesson01_what_is_ai";

  const lessonsDir = path.join(process.cwd(), "src/content/modules", module, "lessons", slug);
  const filePath = path.join(lessonsDir, "lesson.md");

  const result: Record<string, unknown> = {
    cwd: process.cwd(),
    module,
    slug,
    lessonsDir,
    filePath,
    lessonsDirExists: fs.existsSync(lessonsDir),
    fileExists: fs.existsSync(filePath),
  };

  if (fs.existsSync(filePath)) {
    const stat = fs.statSync(filePath);
    result.fileSize = stat.size;
    result.fileMode = stat.mode;
    try {
      const content = fs.readFileSync(filePath, "utf8");
      result.contentLength = content.length;
      result.firstChars = content.substring(0, 50);
    } catch (e) {
      result.readError = String(e);
    }
  }

  // List all module dirs
  const modulesDir = path.join(process.cwd(), "src/content/modules");
  if (fs.existsSync(modulesDir)) {
    result.modules = fs.readdirSync(modulesDir);
  }

  return NextResponse.json(result);
}
