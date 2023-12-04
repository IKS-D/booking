import { createServerClient, CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const formData = await request.json();
  const email = formData.email;
  const password = formData.password;

  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      // options: {
      //   emailRedirectTo: `${requestUrl.origin}/auth/callback`,
      // },
    });

    if(error) {
      return new NextResponse(
        JSON.stringify({ error: error.message }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "User registered successfully", data: data }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error", error_message: error }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // if (error) {
  //   return NextResponse.redirect(
  //     `${requestUrl.origin}/registration/user?error=Could not authenticate user`,
  //     {
  //       // a 301 status is required to redirect from a POST to a GET route
  //       status: 301,
  //     }
  //   );
  //   // NextResponse.json({data, error})
  // }

  // return NextResponse.redirect(
  //   `${requestUrl.origin}/?message=User registered successfully`,
  //   {
  //     // a 301 status is required to redirect from a POST to a GET route
  //     status: 301,
  //   }
  // );
  // NextResponse.json({data})
}
