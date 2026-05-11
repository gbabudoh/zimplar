import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // 1. If user is logged in and trying to access login or landing page, redirect to dashboard
  if (isLoggedIn && (nextUrl.pathname === "/login" || nextUrl.pathname === "/")) {
    const role = (req.auth?.user as { role?: string })?.role;
    
    let dashboardPath = "/dashboard/student";
    if (role === "ADMIN") dashboardPath = "/admin";
    else if (role === "TEACHER") dashboardPath = "/dashboard/teacher";
    else if (role === "ORG_ADMIN") dashboardPath = "/dashboard/org";
    
    return NextResponse.redirect(new URL(dashboardPath, nextUrl));
  }

  // 2. Allow access to everything else
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|zimplarlogo.png|favicon.png|icon.png|manifest.json).*)"],
};
