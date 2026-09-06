import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const module = searchParams.get("module") || "ia";
  const slug = searchParams.get("slug") || "lesson01_what_is_ai";

  // Sanitize: only allow alphanumeric, hyphens, and underscores
  if (!/^[a-zA-Z0-9_-]+$/.test(module) || !/^[a-zA-Z0-9_-]+$/.test(slug)) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  const contentRoot = path.join(process.cwd(), "src/content/modules");
  const filePath = path.join(contentRoot, module, "lessons", slug, "lesson.md");

  // Ensure resolved path is within content directory
  if (!filePath.startsWith(contentRoot)) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

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

        // Test MDX import (use dynamic import for ESM compatibility)
        try {
          await import("next-mdx-remote");
          await import("next-mdx-remote/rsc");
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
