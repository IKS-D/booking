import { getListingById } from "@/actions/listings/getListings";
import { getReservationById } from "@/actions/reservations/reservationsQueries";
import getCurrentUser from "@/actions/users/usersQueries";
import { HostNewReservationEmailTemplate } from "@/components/email/HostNewReservationEmailTemplate";
import CreateReservationForm from "@/components/reservations/create/CreateReservationForm";
import { notFound } from "next/navigation";
import React from "react";

export default async function page({ params }: { params: { id: string } }) {
  const { data: listing, error } = await getListingById(parseInt(params.id));
  const user = await getCurrentUser();

  if (error) {
    notFound();
  }

  return (
    <div
      className="
        w-[500px]    
        m-auto
      "
    >
      <CreateReservationForm listing={listing!} user={user!} />
    </div>
  );
}
