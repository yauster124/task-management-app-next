import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // If accessing `/` and no token → go to /login
  if (req.nextUrl.pathname === "/" && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If accessing `/` and token exists → go to /dashboard/tasks
  if (req.nextUrl.pathname === "/" && token) {
    return NextResponse.redirect(new URL("/dashboard/tasks", req.url));
  }

  return NextResponse.next();
}