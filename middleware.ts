import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const protectedRoutes = createRouteMatcher(["/learn(.*)", "/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (protectedRoutes(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
