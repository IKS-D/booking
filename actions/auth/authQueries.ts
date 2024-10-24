"use server";

import { getReservations } from "../reservations/reservationsQueries";
import { getPersonalListings } from "../listings/listingsQueries";
import { getSupabaseServerClient, getSupabaseServiceClient } from "@/supabase/supabase-clients";

export async function signUpUsingEmailAndPassword(data: {
  email: string;
  password: string;
  confirmPassword: string;
}) {
  const { data: responseData, error } = await getSupabaseServerClient().auth.signUp({
    email: data.email,
    password: data.password
  });

  return { responseData, error: error }
}

export async function signInUsingEmailAndPassword(data: {
  email: string;
  password: string;
}) {
  const { error } = await getSupabaseServerClient().auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  return { error };
}

export async function signOut() {
  const { error } = await getSupabaseServerClient().auth.signOut();

  return { error };
}

export async function deleteUser() {
  // Get the user
  const { data: { user }, error: getUserError } = await getSupabaseServerClient().auth.getUser();

  if (getUserError) {
    return { error: getUserError };
  }

  // Double check the listings and reservations
  const { data: reservations, error: reservationsError } = await getReservations(user!.id);
  if(reservationsError){
    return { error: reservationsError };
  }
  let reservationCount = 0;
  if(reservations && reservations?.length > 0){
    // Check for active reservations
    const today = new Date();
    for(const reservation of reservations){
      if(reservation.status === 1 || reservation.status === 2){
        const startDate = new Date(reservation.start_date);
        const endDate = new Date(reservation.end_date);
        if(startDate > today || endDate > today){
          reservationCount++;
        }
      }
    }
  }
  if( reservationCount > 0){
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
  await signOut();

  // Attempt to delete the user
  const { error: deleteError } = await getSupabaseServiceClient().auth.admin.deleteUser(user!.id);

  return { error: deleteError };
}