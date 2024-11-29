import {
  userProfileExists,
  hostProfileExists,
} from "@/actions/users/usersQueries";
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  try {
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
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const userResponse = await supabase.auth.getUser();
    const user = userResponse.data?.user;

    // if user undefined, redirect to login
    if (!user && !publicRoutes.includes(path) && path !== "/login") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // If user does not have a profile, redirect to profile registration
    if (
      user &&
      !(await userProfileExists(user.id)) &&
      !publicRoutes.includes(path) &&
      path !== "/registration/profile"
    ) {
      return NextResponse.redirect(
        new URL("/registration/profile", request.url)
      );
    }

    if (
      user &&
      hostRoutes.includes(path) &&
      !(await hostProfileExists(user.id))
    ) {
      return NextResponse.redirect(new URL("/not-found", request.url));
    }

    return response;
  } catch {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
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
  "/auth/sign-out",
  "/auth/callback",
  "/payment/callback",
  "/auth/login",
  "/api/listings",
];

const hostRoutes = ["/reservations/host", "/listings/personal"];
