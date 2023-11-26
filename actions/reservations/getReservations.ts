"use server";

import supabase from "@/supabase/supabase";
import { DbResultOk } from "@/supabase/database.types";

type ReservationsWithDetails = DbResultOk<ReturnType<typeof getReservations>>;
export type ReservationWithDetails = ReservationsWithDetails[0];

export async function getReservations(userId: string) {
  let { data: reservations, error } = await getReservationsBase().eq(
    "user_id",
    userId
  );

  if (error) {
    console.error(error);
  }

  return { data: reservations, error: error };
}

export async function getHostPendingReservations(hostId: string) {
  let { data: reservations, error } = await getReservationsBase()
    .eq("status.name", "pending")
    .eq("listing.host_id", hostId);

  if (error) {
    console.error(error);
  }

  return { data: reservations, error: error };
}

function getReservationsBase() {
  return supabase.from("reservations").select(
    `
    *,
    listing: listings!inner (
      *,
      category: listing_category (name)
    ),
    ordered_services (
      id,
      service: services (*)
    ),
    status: reservation_status!inner (name),
    guest: profiles!inner (
      *
    )
  `
  );
}
