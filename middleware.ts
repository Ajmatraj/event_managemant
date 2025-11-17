import { type NextRequest, NextResponse } from "next/server"
import { verifyJwtToken } from "./lib/auth"

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define paths that are protected
  const isProtectedPath = path.startsWith("/dashboard") || path.startsWith("/profile") || path.startsWith("/admin")

  // Define paths that are auth paths (login, register)
  const isAuthPath = path === "/login" || path === "/register"

  const token = request.cookies.get("token")?.value

  if (isProtectedPath) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    try {
      const payload = await verifyJwtToken(token)

      // Check for admin routes
      if (path.startsWith("/admin") && payload?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }

      return NextResponse.next()
    } catch (error) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Redirect to admin if user is already logged in and trying to access auth pages
  if (isAuthPath && token) {
    try {
      const payload = await verifyJwtToken(token)
      if (payload) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    } catch (error) {
      // Token is invalid, let them access the auth pages
      return NextResponse.next()
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/admin/:path*", "/login", "/register"],
}

