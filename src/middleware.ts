import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory rate limiter for API routes
const rateLimit = new Map<string, { count: number; reset: number }>();
const MAX_REQUESTS = 60; // per window
const WINDOW_MS = 60_000; // 1 minute

// Periodic cleanup to prevent memory leaks (every 5 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimit) {
    if (now > entry.reset) rateLimit.delete(key);
  }
}, 300_000).unref();

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Rate limit API routes
  if (pathname.startsWith("/api/")) {
    const ip = getClientIp(req);
    const key = `${ip}:${pathname.split("/").slice(0, 3).join("/")}`;
    const now = Date.now();
    const entry = rateLimit.get(key);

    if (!entry || now > entry.reset) {
      rateLimit.set(key, { count: 1, reset: now + WINDOW_MS });
    } else if (entry.count >= MAX_REQUESTS) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429 }
      );
    } else {
      entry.count++;
    }
  }

  // Block common attack paths
  if (
    pathname.includes("/.env") ||
    pathname.includes("/wp-admin") ||
    pathname.includes("/wp-login") ||
    pathname.includes("/.git") ||
    pathname.includes("/xmlrpc") ||
    pathname.includes("/phpinfo")
  ) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
};
