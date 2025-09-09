import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // If accessing `/` and token exists → go to /dashboard/tasks
  if (req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard/tasks", req.url));
  }

  return NextResponse.next();
}