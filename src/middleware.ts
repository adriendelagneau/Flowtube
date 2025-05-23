import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

import { ratelimit } from "./lib/ratelimit";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        "127.0.0.1";


    // ✅ Rate limit ALL /api/* requests
    if (pathname.startsWith("/api/")) {
        const { success, limit, remaining, reset } = await ratelimit.limit(ip);

        if (!success) {
            console.warn(`Rate limit exceeded for IP: ${ip}`);
            return new NextResponse("Too many requests", {
                status: 429,
                headers: {
                    "X-RateLimit-Limit": limit.toString(),
                    "X-RateLimit-Remaining": remaining.toString(),
                    "X-RateLimit-Reset": reset.toString(),
                },
            });
        }
    }

    // ✅ Auth check for /studio/*
    if (pathname.startsWith("/studio")) {
        const sessionCookie = getSessionCookie(request);
        if (!sessionCookie) {
            console.log("Rejected by middleware: no session for /studio");
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/api/:path*", "/studio/:path*"], // Applies to both
};
