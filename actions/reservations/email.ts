"use server";

import { NewReservationEmailTemplate } from "../../components/EmailTemplate";
import { Resend } from "resend";
import { getReservationById, getReservations } from "./reservationsQueries";

if (!process.env.NEXT_PUBLIC_RESEND_API_KEY) {
  throw new Error("NEXT_PUBLIC_RESEND_API_KEY is not set");
}

if (!process.env.NEXT_PUBLIC_EMAIL) {
  throw new Error("NEXT_PUBLIC_EMAIL is not set");
}

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export const sendNewReservationEmail = async (reservation_id: number) => {
  const { data: reservation, error } = await getReservationById(reservation_id);

  if (error || !reservation) {
    console.error(error);
    return;
  }

  try {
    await resend.emails.send({
      from: "Booking <onboarding@resend.dev>",
      to: [process.env.NEXT_PUBLIC_EMAIL!],
      subject: "You have a new reservation on Booking",
      react: NewReservationEmailTemplate({
        reservation: reservation,
      }) as React.ReactElement,
    });
  } catch (error) {
    console.error(error);
  }
};
