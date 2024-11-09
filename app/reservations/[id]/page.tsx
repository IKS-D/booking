import { getListingById } from "@/actions/listings/listingsQueries";
import getCurrentUser from "@/actions/users/usersQueries";
import CreateReservationForm from "@/components/reservations/create/CreateReservationForm";
import { notFound } from "next/navigation";
import React from "react";

export default async function page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
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
