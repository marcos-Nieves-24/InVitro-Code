import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const module = searchParams.get("module") || "ia";
  const slug = searchParams.get("slug") || "lesson01_what_is_ai";
  const testMdx = searchParams.get("testMdx") === "true";

  const filePath = path.join(process.cwd(), "src/content/modules", module, "lessons", slug, "lesson.md");

  const result: Record<string, unknown> = {
    module,
    slug,
    filePath,
    fileExists: fs.existsSync(filePath),
  };

  if (fs.existsSync(filePath)) {
    try {
      const source = fs.readFileSync(filePath, "utf8");
      try {
        const { content, data } = matter(source);
        result.grayMatterOk = true;
        result.contentLength = content.length;
        result.frontmatterKeys = Object.keys(data);

        // Test MDX import
        try {
          // Just verify mdx modules resolve
          require.resolve("next-mdx-remote");
          require.resolve("next-mdx-remote/rsc");
          result.mdxModulesResolve = true;
        } catch (e: unknown) {
          result.mdxModulesResolve = false;
          result.mdxResolveError = e instanceof Error ? e.message : String(e);
        }
      } catch (e: unknown) {
        result.grayMatterOk = false;
        result.grayMatterError = e instanceof Error ? e.message : String(e);
      }
    } catch (e: unknown) {
      result.readError = e instanceof Error ? e.message : String(e);
    }
  }

  return NextResponse.json(result);
}
