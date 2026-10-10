import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = process.env.SESSION_SECRET || "uni-report-tz-super-secret-key-2026";
const encodedKey = new TextEncoder().encode(secretKey);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Protect /dashboard, /editor, and /admin routes
  const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/editor") || pathname.startsWith("/admin");
  const isAuthRoute = pathname.startsWith("/auth/");

  const sessionCookie = request.cookies.get("unireport_session")?.value;
  let isValid = false;
  let decodedPayload: any = null;

  if (sessionCookie) {
    try {
      const { payload } = await jwtVerify(sessionCookie, encodedKey, {
        algorithms: ["HS256"],
      });
      isValid = true;
      decodedPayload = payload;
    } catch (e) {
      isValid = false;
    }
  }

  // Redirect unauthenticated users to login
  if (isProtectedRoute && !isValid) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Admin Route Protection Layer
  if (pathname.startsWith("/admin") && isValid && decodedPayload?.role !== "UNIREPORT_ADMIN") {
    // Standard students trying to access /admin get bounced back to /dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect authenticated users away from auth pages (login/register) to dashboard
  if (isAuthRoute && isValid) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
