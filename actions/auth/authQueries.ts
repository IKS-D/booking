"use server";

import supabase from "@/supabase/supabase";
import { createServerClient, CookieOptions } from "@supabase/ssr";
import { QueryData } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getReservations } from "../reservations/reservationsQueries";
import { getPersonalListings } from "../listings/getListings";

async function getSupabaseServerClient() {
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

  return supabase;
}

export async function signUpUsingEmailAndPassword(data: {
  email: string;
  password: string;
  confirmPassword: string;
}) {
  const supabase = await getSupabaseServerClient();

  const { data: responseData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password
  });

  return { responseData, error: error }
}

export async function signInUsingEmailAndPassword(data: {
  email: string;
  password: string;
}) {
  const supabase = await getSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  return { error };
}

export async function signOut() {
  const supabase = await getSupabaseServerClient();

  const { error } = await supabase.auth.signOut();

  return { error };
}

export async function deleteUser() {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!,
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

  // Get the user
  const { data: { user }, error: getUserError } = await supabase.auth.getUser();

  if (getUserError) {
    return { error: getUserError };
  }

  // Double check the listings and reservations
  const { data: reservations, error: reservationsError } = await getReservations(user!.id);
  if(reservationsError){
    return { error: reservationsError };
  }
  if( reservations && reservations?.length > 0){
    return { error: { message: "User has reservations" } };
  }
  const { data: listings, error: listingsError } = await getPersonalListings(user!.id);
  if(listingsError){
    return { error: listingsError };
  }
  if( listings && listings?.length > 0){
    return { error: { message: "User has listings" } }
  }

  // Attempt to sign the user out
  const { error: signOutError } = await supabase.auth.signOut();

  if (signOutError) {
    return { error: signOutError };
  }

  // Attempt to delete the user
  const { error: deleteError } = await supabase.auth.admin.deleteUser(user!.id);

  if (deleteError) {
    return { error: deleteError };
  }

  return { error: undefined };
}