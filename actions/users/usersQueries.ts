"use server";

import { QueryData } from "@supabase/supabase-js";
import { getPersonalListings } from "../listings/listingsQueries";
import { createSupabaseServerClient } from "@/supabase/server";
import { createSupabaseBrowserClient } from "@/supabase/client";

export default async function getCurrentUser() {
  const supabaseServerClient = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser();

  return user;
}

export async function getCurrentUserProfile() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return null;
  }

  const { data: profile, error } = await createSupabaseBrowserClient()
    .from("profiles")
    .select("*")
    .eq("id", currentUser.id)
    .single();

  return profile;
}

export async function userProfileExists(userId: string) {
  // not using getUserProfileById because it throws error due to .single() when profile doesn't exist
  let { data: profile, error } = await createSupabaseBrowserClient()
    .from("profiles")
    .select("*")
    .eq("id", userId);

  if (error || !profile || profile.length == 0) {
    return false;
  }
  return true;
}

export type UserProfile = QueryData<ReturnType<typeof getUserProfileById>>;

export async function getUserProfileById(id: string) {
  const { data: profile, error } = await createSupabaseBrowserClient()
    .from("profiles")
    .select("*")
    .eq("id", id)
    .limit(1)
    .single();

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
  let { data: profile, error } = await createSupabaseBrowserClient()
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
  let { data: profile, error } = await createSupabaseBrowserClient()
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

  return { profile, error };
}

export async function hostProfileExists(userId: string) {
  // not using getUserProfileById because it throws error due to .single() when profile doesn't exist
  let { data: host, error } = await createSupabaseBrowserClient()
    .from("hosts")
    .select("*")
    .eq("id", userId);

  if (error || !host || host.length == 0) {
    return false;
  }
  return true;
}

export type HostProfile = QueryData<ReturnType<typeof getHostProfileById>>;

export async function getHostProfileById(id: string) {
  const { data: host, error } = await createSupabaseBrowserClient()
    .from("hosts")
    .select("*")
    .eq("id", id)
    .single();

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
  let { data: host, error } = await createSupabaseBrowserClient()
    .from("hosts")
    .insert({
      id: userId,
      personal_code: personalCode,
      bank_account: bankAccount,
    })
    .select()
    .single();

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
  let { data: host, error } = await createSupabaseBrowserClient()
    .from("hosts")
    .update({
      personal_code: personalCode,
      bank_account: bankAccount,
    })
    .eq("id", userId);

  return { host, error };
}

export async function deleteHost() {
  // Get current user
  const user = await getCurrentUser();

  // Double check listings
  const { data: listings, error: listingsError } = await getPersonalListings(
    user!.id
  );
  if (listingsError) {
    return { error: listingsError };
  }
  if (listings && listings?.length > 0) {
    return { error: { message: "User has listings" } };
  }

  let { error } = await createSupabaseBrowserClient()
    .from("hosts")
    .delete()
    .eq("id", user!.id);

  return { error };
}

export async function getHostIdByReservationId(reservationId: number) {
  const { data: host, error } = await createSupabaseBrowserClient()
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

  return { data: host?.listing?.host_id, error: error };
}
