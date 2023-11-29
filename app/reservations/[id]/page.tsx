import { getListing, getListingById } from "@/actions/listings/getListings";
import { getReservationById } from "@/actions/reservations/reservationsQueries";
import getCurrentUser from "@/actions/users/getCurrentUser";
import { NewReservationEmailTemplate } from "@/components/email/NewReservationEmailTemplate";
import CreateReservationForm from "@/components/reservations/create/CreateReservationForm";
import React from "react";

export default function page() {
  return (
    <div
      className="
        w-[500px]
        justify-center
      "
    >
      <CreateReservationForm />
    </div>
  );
}
