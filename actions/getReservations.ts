import supabase from "@/supabase/supabase";
import { DbResult, DbResultOk } from "@/supabase/database.types";

type ReservationsWithDetails = DbResultOk<ReturnType<typeof getReservations>>;
export type ReservationWithDetails = ReservationsWithDetails[0];

export async function getReservations(userId: string) {
  let { data: reservations, error } = await supabase
    .from("reservations")
    .select(
      `
    *,
    listing: listings!inner (
      *,
      category: listing_category (name)
    ),
    ordered_services!inner (
      id,
      service: services (*)
    ),
    status: reservation_status!inner (name),
    guest: profiles!inner (
      *
    )
  `
    )
    .eq("user_id", userId);

  if (error) {
    console.error(error);
  }

  return { data: reservations, error: error };
}

export async function getHostPendingReservations(hostId: string) {
  let { data: reservations, error } = await supabase
    .from("reservations")
    .select(
      `
    *,
    listing: listings!inner (
      *,
      category: listing_category (name)
    ),
    ordered_services!inner (
      id,
      service: services (*)
    ),
    status: reservation_status!inner (name),
    guest: profiles!inner (
      *
    )
  `
    )
    .eq("status.name", "pending")
    .eq("listing.host_id", hostId);

  if (error) {
    console.error(error);
  }

  return { data: reservations, error: error };
}
