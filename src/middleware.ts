import { clerkMiddleware } from "@clerk/nextjs/server";

// Auth desactivado durante desarrollo/pulido
export default clerkMiddleware();

export const config = {
  matcher: [],
};
