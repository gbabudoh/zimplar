import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");
  const isAuthRoute = nextUrl.pathname === "/login" || nextUrl.pathname === "/signup" || nextUrl.pathname === "/";

  // Redirect helper to route logged-in users to their corresponding dashboards
  const getDashboardRedirectUrl = (role: string, email: string) => {
    if (role === "ADMIN") return "/admin";
    if (role === "TEACHER") return "/dashboard/teacher";
    if (role === "ORG_ADMIN") {
      if (email === "ngo@zimplar.com") return "/dashboard/ngo";
      if (email === "private@zimplar.com") return "/dashboard/private";
      return "/dashboard/org";
    }
    return "/dashboard/student";
  };

  // 1. Unauthenticated users trying to access protected admin or dashboard pages
  if (!isLoggedIn) {
    if (isAdminRoute || isDashboardRoute) {
      let callbackUrl = nextUrl.pathname;
      if (nextUrl.search) {
        callbackUrl += nextUrl.search;
      }
      const encodedCallbackUrl = encodeURIComponent(callbackUrl);
      return NextResponse.redirect(new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl));
    }
    return NextResponse.next();
  }

  // 2. Authenticated users
  const role = (req.auth?.user as { role?: string })?.role || "STUDENT";
  const email = req.auth?.user?.email || "";

  // If user is logged in and tries to access login/signup/landing pages, redirect to dashboard
  // unless we explicitly want them to clear their session (e.g. ?expired=true)
  if (isAuthRoute && !nextUrl.searchParams.has("expired")) {
    const dashboardPath = getDashboardRedirectUrl(role, email);
    return NextResponse.redirect(new URL(dashboardPath, nextUrl));
  }

  // Enforce ADMIN role on admin routes
  if (isAdminRoute && role !== "ADMIN") {
    return NextResponse.redirect(new URL(getDashboardRedirectUrl(role, email), nextUrl));
  }

  // Enforce role-based routing for dashboards
  if (isDashboardRoute) {
    // If accessing the raw "/dashboard" path, redirect to their default dashboard
    if (nextUrl.pathname === "/dashboard" || nextUrl.pathname === "/dashboard/") {
      return NextResponse.redirect(new URL(getDashboardRedirectUrl(role, email), nextUrl));
    }

    if (nextUrl.pathname.startsWith("/dashboard/teacher") && role !== "TEACHER") {
      return NextResponse.redirect(new URL(getDashboardRedirectUrl(role, email), nextUrl));
    }
    if (nextUrl.pathname.startsWith("/dashboard/student") && role !== "STUDENT") {
      return NextResponse.redirect(new URL(getDashboardRedirectUrl(role, email), nextUrl));
    }
    if (nextUrl.pathname.startsWith("/dashboard/org") && role !== "ORG_ADMIN") {
      return NextResponse.redirect(new URL(getDashboardRedirectUrl(role, email), nextUrl));
    }
    if (nextUrl.pathname.startsWith("/dashboard/ngo") && (role !== "ORG_ADMIN" || email !== "ngo@zimplar.com")) {
      return NextResponse.redirect(new URL(getDashboardRedirectUrl(role, email), nextUrl));
    }
    if (nextUrl.pathname.startsWith("/dashboard/private") && (role !== "ORG_ADMIN" || email !== "private@zimplar.com")) {
      return NextResponse.redirect(new URL(getDashboardRedirectUrl(role, email), nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|zimplarlogo.png|favicon.png|icon.png|manifest.json).*)"],
};
