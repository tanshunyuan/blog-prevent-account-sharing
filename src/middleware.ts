import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { ROUTE_PATHS } from "./utils/route-paths";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/app(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (req.nextUrl.pathname === ROUTE_PATHS.DEFAULT) {
    return NextResponse.redirect(new URL(ROUTE_PATHS.SIGNIN, req.url));
  }

  if (isProtectedRoute(req)) auth().protect();

  const isAuthenticatedUserAtPublicPages =
    auth().userId &&
    (req.nextUrl.pathname === ROUTE_PATHS.DEFAULT ||
      req.nextUrl.pathname === ROUTE_PATHS.SIGNIN ||
      req.nextUrl.pathname === ROUTE_PATHS.SIGNUP);
  if (isAuthenticatedUserAtPublicPages) {
    const orgSelection = new URL(ROUTE_PATHS.APP.DASHBOARD, req.url);
    return NextResponse.redirect(orgSelection);
  }
});

export const config = {
  matcher: ["/((?!.*\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};