import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export function middleware(req: NextRequest) {
    if (req.nextUrl.pathname === "/home" || req.nextUrl.pathname === "/about" || req.nextUrl.pathname === "/profile") {
        return NextResponse.redirect(new URL("/activity", req.nextUrl))
    }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
