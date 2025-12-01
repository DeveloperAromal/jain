/* eslint-disable @typescript-eslint/no-unused-vars */
import { jwtDecode } from "jwt-decode";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const tokenCookie = request.cookies.get("token");
  const token = tokenCookie?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const decoded: { exp: number } = jwtDecode(token);

    const currentTime = Math.floor(Date.now() / 1000);

    if (decoded.exp < currentTime) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  } catch (e) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}


export const config = {
  matcher: [
    "/learn/dashboard/:path*", 
    "/admin/:path*",
  ],
};
