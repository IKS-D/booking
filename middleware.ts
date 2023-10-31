import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const path = req.nextUrl.pathname;

  const supabase = createMiddlewareClient({ req, res });

  const session = await supabase.auth.getSession();
  const user = session.data.session?.user;

  // if user undefined, redirect to login
  if (!user && !publicRoutes.includes(path) && path !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

const publicRoutes = ["/login", "/registration/accountcredentials", "/registration/accountinformation", "/", "/listings", "/listings/[id]", "/auth/sign-in"];
