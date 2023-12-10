"use server";

import supabase from "@/supabase/supabase";
import { createServerClient } from "@supabase/ssr";
import { QueryData } from "@supabase/supabase-js";
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

export async function userProfileExists(userId: string) {
  // not using getUserProfileById because it throws error due to .single() when profile doesn't exist
  let { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId);
  if (!error && (!profile || profile.length == 0)) {
    return false;
  }
  return true;
}

export type UserProfile = QueryData<ReturnType<typeof getUserProfileById>>;

export async function getUserProfileById(id: string) {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .limit(1)
    .single();

  if (error) {
    console.error(error);
  }

  return { data: profile, error: error };
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

export async function updateProfile({
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
    .update({
      first_name: firstName,
      last_name: lastName,
      birth_date: dateOfBirth,
      phone: phoneNumber,
      photo: photo,
      country: country,
      city: city,
    })
    .eq("id", userId);

  if (error) {
    console.error(error);
  }

  return { profile, error };
}

export async function hostProfileExists(userId: string) {
  // not using getUserProfileById because it throws error due to .single() when profile doesn't exist
  let { data: host, error } = await supabase
    .from("hosts")
    .select("*")
    .eq("id", userId);

  if (!error && (!host || host.length == 0)) {
    return false;
  }
  return true;
}

export type HostProfile = QueryData<ReturnType<typeof getHostProfileById>>;

export async function getHostProfileById(id: string) {
  const { data: host, error } = await supabase
    .from("hosts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
  }

  return { data: host, error: error };
}

export async function insertHost({
  userId,
  personalCode,
  bankAccount,
}: {
  userId: string;
  personalCode: string;
  bankAccount: string;
}) {
  let { data: host, error } = await supabase
    .from("hosts")
    .insert({
      id: userId,
      personal_code: personalCode,
      bank_account: bankAccount,
    })
    .select()
    .single();

  if (error) {
    console.error(error);
  }

  return { host, error };
}

export async function updateHost({
  userId,
  personalCode,
  bankAccount,
}: {
  userId: string;
  personalCode: string;
  bankAccount: string;
}) {
  let { data: host, error } = await supabase
    .from("hosts")
    .update({
      personal_code: personalCode,
      bank_account: bankAccount,
    })
    .eq("id", userId);

  if (error) {
    console.error(error);
  }

  return { host, error };
}

export async function deleteHost({ userId }: { userId: string }) {
  let { error } = await supabase.from("hosts").delete().eq("id", userId);

  if (error) {
    console.error(error);
  }

  return { error };
}

export async function getHostIdByReservationId(reservationId: number) {
  const { data: host, error } = await supabase
    .from("reservations")
    .select(
      `
      id,
      listing: listings!inner (
        host_id
    )
    ` 
    )
    .eq("id", reservationId)
    .limit(1)
    .single();

  if (error) {
    console.error(error);
  }

  return { data: host?.listing?.host_id, error: error };
}
