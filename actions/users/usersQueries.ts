"use server";

import supabase from "@/supabase/supabase";
import { createServerClient } from "@supabase/ssr";
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

export async function profileExists(userId: string) {
  // not using getUserProfileById because it throws error due to .single() when profile doesn't exist
  let { data: profile, error } = await supabase.from("profiles").select("*").eq("id", userId); 
  if(!error && (!profile || profile.length == 0)){
    return false;
  }
  return true;
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

export async function insertProfile({
  userId,
  firstName,
  lastName,
  dateOfBirth,
  phoneNumber,
  photo,
  country,
  city,
}: {
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  photo: string;
  country: string;
  city: string;
}) {
  let { data: profile, error } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      first_name: firstName,
      last_name: lastName,
      birth_date: dateOfBirth,
      phone: phoneNumber,
      photo: photo,
      country: country,
      city: city,
    })
    .select()
    .single();

  if (error) {
    console.error(error);
  }

  return { profile, error };
}
