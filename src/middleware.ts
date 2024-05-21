import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { ROUTE_PATHS } from "./utils/route-paths";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/app(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (req.nextUrl.pathname === ROUTE_PATHS.DEFAULT) {
    return NextResponse.redirect(new URL(ROUTE_PATHS.SIGNIN, req.url));
  }
  if (!auth().userId) {
    return auth().redirectToSignIn({
      returnBackUrl: ROUTE_PATHS.SIGNIN
    })
  }

  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!.*\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};