import { createSupabaseServerClient } from "@/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.searchParams.get("origin");
  const header = request.headers;

  if (code) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // if (code) {
  //   const cookieStore = await cookies();

  //   const supabase = await getSupabaseServerClient();

  //     createServerClient(
  //     process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  //     {
  //       cookies: {
  //         get(name: string) {
  //           return cookieStore.get(name)?.value;
  //         },
  //         set(name: string, value: string, options: CookieOptions) {
  //           cookieStore.set({ name, value, ...options });
  //         },
  //         remove(name: string, options: CookieOptions) {
  //           cookieStore.set({ name, value: "", ...options });
  //         },
  //       },
  //     }
  //   );

  //   const { error } = await supabase.auth.exchangeCodeForSession(code);
  //   if (error) {
  //     // There was an error creating a session
  //     console.error(error);
  //   }
  // }
  // Determine the destination based on the origin
  const destination = origin === "/login" ? "/" : "/registration/profile";
  const protocol = header.get("x-forwarded-proto") || "http";
  const host = header.get("host");

  const redirectUrl = `${protocol}://${host}${destination}`;
  // console.log("redirectUrl", redirectUrl);

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(redirectUrl);
}
