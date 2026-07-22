import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const module = searchParams.get("module") || "ia";
  const slug = searchParams.get("slug") || "lesson01_what_is_ai";

  const filePath = path.join(process.cwd(), "src/content/modules", module, "lessons", slug, "lesson.md");

  const result: Record<string, unknown> = {
    module,
    slug,
    filePath,
    fileExists: fs.existsSync(filePath),
    cwd: process.cwd(),
  };

  if (fs.existsSync(filePath)) {
    try {
      const source = fs.readFileSync(filePath, "utf8");

      // Test gray-matter
      try {
        const { content, data } = matter(source);
        result.grayMatterOk = true;
        result.contentLength = content.length;
        result.frontmatterKeys = Object.keys(data);
      } catch (e: unknown) {
        result.grayMatterOk = false;
        result.grayMatterError = e instanceof Error ? e.message : String(e);
      }
    } catch (e: unknown) {
      result.readError = e instanceof Error ? e.message : String(e);
    }
  }

  // Test if gray-matter and mdx modules are accessible
  try {
    require.resolve("gray-matter");
    result.grayMatterResolved = true;
  } catch {
    result.grayMatterResolved = false;
  }
  try {
    require.resolve("next-mdx-remote");
    result.mdxResolved = true;
  } catch {
    result.mdxResolved = false;
  }

  return NextResponse.json(result);
}
