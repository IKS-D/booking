import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { profileExists } from "./actions/users/usersQueries";
import { profile } from "console";
import { toast } from "sonner";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
  const path = request.nextUrl.pathname;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const session = await supabase.auth.getSession();
  const user = session.data.session?.user;

  // if user undefined, redirect to login
  if (!user && !publicRoutes.includes(path) && path !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user does not have a profile, redirect to profile registration
  if(user && !(await profileExists(user.id)) && !publicRoutes.includes(path) && path !== "/registration/profile"){
    return NextResponse.redirect(new URL("/registration/profile", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

const publicRoutes = [
  "/login",
  "/registration",
  "/registration/user",
  "/registration/profile",
  "/",
  "/listings",
  "/listings/[id]",
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/sign-out", // needed so a user without profile could logout
  "/auth/callback",
  "/payment/callback",
];
