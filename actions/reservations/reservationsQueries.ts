"use server";

import supabase from "@/supabase/supabase";
import { DbResultOk, TableInserts } from "@/supabase/database.types";
import { revalidatePath } from "next/cache";
import { sendNewReservationEmail } from "./email";

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

export async function getReservationById(reservationId: number) {
  let { data: reservation, error } = await getReservationsBase()
    .eq("id", reservationId)
    .single();

  if (error) {
    console.error(error);
  }

  return { data: reservation, error: error };
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

export async function updateReservationStatus(
  reservationId: string,
  statusId: number
) {
  let { error } = await supabase
    .from("reservations")
    .update({ status: statusId })
    .eq("id", reservationId);

  if (error) {
    console.error(error);
  }

  return { error };
}

export async function rejectReservation(reservationId: string) {
  let { error } = await supabase
    .from("reservations")
    .update({ status: 3 })
    .eq("id", reservationId);

  if (error) {
    console.error(error);
  }

  revalidatePath("/reservations/pending");

  return { error };
}

export async function confirmReservation(reservationId: string) {
  let { error } = await supabase
    .from("reservations")
    .update({ status: 2 })
    .eq("id", reservationId);

  if (error) {
    console.error(error);
  }

  revalidatePath("/reservations/pending");

  return { error };
}

export async function cancelReservation(reservationId: string) {
  let { error } = await supabase
    .from("reservations")
    .update({ status: 4 })
    .eq("id", reservationId);

  if (error) {
    console.error(error);
  }

  revalidatePath("/reservations");

  return { error };
}

export async function insertReservation({
  listingId,
  userId,
  orderedServices,
  startDate,
  endDate,
  totalPrice,
}: {
  listingId: number;
  userId: string;
  orderedServices: { service: number }[];
  startDate: string;
  endDate: string;
  totalPrice: number;
}) {
  let { data: reservation, error } = await supabase
    .from("reservations")
    .insert({
      creation_date: new Date().toISOString(),
      listing_id: listingId,
      user_id: userId,
      start_date: startDate,
      end_date: endDate,
      status: 1,
      total_price: totalPrice,
    })
    .select()
    .single();

  if (error) {
    console.error(error);
  }

  if (reservation && orderedServices.length > 0) {
    await insertOrderedServices(reservation.id, orderedServices);
  }

  if (reservation?.id) {
    await sendNewReservationEmail(reservation.id);
  }

  return { reservation, error };
}

export async function insertOrderedServices(
  reservationId: number,
  orderedServices: { service: number }[]
) {
  let { error } = await supabase.from("ordered_services").insert(
    orderedServices.map((orderedService) => ({
      reservation_id: reservationId,
      service_id: orderedService.service,
    }))
  );

  if (error) {
    console.error(error);
  }

  return { error };
}

export async function insertPayment(payment: TableInserts<"payments">) {
  let { error } = await supabase.from("payments").insert(payment).select();

  if (error) {
    console.error(error);
  }

  return { error };
}
