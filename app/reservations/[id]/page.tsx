import CreateReservationForm from "@/components/reservations/create/CreateReservationForm";
import React from "react";

export default function page() {
  return (
    <div
      className="
        w-[500px]
        m-auto
      "
    >
      <CreateReservationForm />
    </div>
  );
}
