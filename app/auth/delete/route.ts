import { createServerClient, CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
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

  const { data: { user }, } = await supabase.auth.getUser();

  try {
    const { error } = await supabase
      .from('auth.users')
      .delete()
      .eq('id', user!.id);

    if(error) {
      return new NextResponse(
        JSON.stringify({ error: error.message }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    await supabase.auth.signOut();

    return new NextResponse(
      JSON.stringify({ message: "User deleted successfully"}),
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
}
