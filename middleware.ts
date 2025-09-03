import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect the /admin/dashboard route
  if (pathname.startsWith("/admin/dashboard")) {
    const isLoggedIn = request.cookies.get("admin-auth")?.value === "true"

    if (!isLoggedIn) {
      const loginUrl = new URL("/admin", request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/dashboard/:path*", "/admin/dashboard"],
}
