import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const publicRoutes = [
  "/",
  "/sign-in",
  "/sign-up",
  "/api/webhooks/clerk",
  "/api/diagnose",
];

const adminRoutes = ["/admin", "/api/admin"];

const authRoutes = ["/sign-in", "/sign-up"];

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  // If user is already signed in and visits sign-in/sign-up, redirect to dashboard
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  if (isAuthRoute) {
    const session = await auth();
    if (session.userId) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Check if the path starts with any public route
  const isPublic = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  if (!isPublic) {
    const session = await auth();
    if (!session.userId) {
      // API routes → 401, pages → redirect to sign-in
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 },
        );
      }
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Check admin routes
    const isAdminRoute = adminRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/"),
    );

    if (isAdminRoute && session.userId) {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.userId)
        .maybeSingle();

      if (data?.role !== "admin") {
        // Non-admin trying to access admin route
        if (pathname.startsWith("/api/")) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // Always run for Clerk-specific frontend API routes
    "/__clerk/(.*)",
  ],
};
