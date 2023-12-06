"use server";
import { DbResultOk } from "@/supabase/database.types";
import supabase from "@/supabase/supabase";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export default async function getCurrentUser() {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getCurrentUserProfile() {
  // Maybe available to make one request instead of two?
  // TODO: check if working
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return null;
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .single();

  if (error) {
    console.error(error);
  }

  return profile;
}

export type UserProfile = ReturnType<typeof getUserProfileById>;

export async function getUserProfileById(id: string) {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
  }

  return profile;
}
