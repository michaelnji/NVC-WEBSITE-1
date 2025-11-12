import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  // Initialize Supabase with cookie adapters for middleware
  createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: "", expires: new Date(0), ...options })
        },
      },
    }
  )

  // Example: protect deep admin paths server-side (keep /admin root public for inline login)
  // const { data: { session } } = await supabase.auth.getSession()
  // if (req.nextUrl.pathname.startsWith("/admin/secure") && !session) {
  //   return NextResponse.redirect(new URL("/admin", req.url))
  // }

  return res
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
  ],
}
