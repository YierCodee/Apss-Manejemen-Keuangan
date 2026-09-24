import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-change-in-production",
);

// Session timeout: 20 minutes in milliseconds
const INACTIVITY_LIMIT = 20 * 60 * 1000;

// Routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/keuangan",
  "/rab",
  "/business-kelompok",
  "/admin",
];

// Routes that require super_admin role
const adminRoutes = ["/admin"];

// Routes that should redirect to dashboard if already logged in
const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("session-token");

  let payload: Record<string, unknown> | null = null;
  if (sessionCookie) {
    try {
      const result = await jwtVerify(sessionCookie.value, JWT_SECRET);
      payload = result.payload as Record<string, unknown>;
    } catch {
      // Invalid or expired token
    }
  }

  const isAuthenticated = payload !== null;
  const role = (payload?.role as string) || "";

  // Check inactivity timeout for authenticated sessions
  if (isAuthenticated && payload?.lastActivity) {
    const now = Date.now();
    const lastActivity = payload.lastActivity as number;

    if (now - lastActivity > INACTIVITY_LIMIT) {
      // Session expired due to inactivity
      // Clear the session cookie and redirect to login
      const loginUrl = new URL("/login", request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.set("session-token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });
      return response;
    }
  }

  // Protected routes: redirect to /login if not authenticated
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Admin routes: redirect to /dashboard if not super_admin
    if (adminRoutes.some((route) => pathname.startsWith(route))) {
      if (role !== "super_admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  // Auth routes: redirect to /dashboard if already authenticated
  if (authRoutes.some((route) => pathname === route)) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/keuangan/:path*",
    "/rab/:path*",
    "/business-kelompok/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
