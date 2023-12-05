"use server";

import { NewReservationEmailTemplate } from "../../components/email/NewReservationEmailTemplate";
import { Resend } from "resend";
import { getReservationById } from "./reservationsQueries";
import { createClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_RESEND_API_KEY) {
  throw new Error("NEXT_PUBLIC_RESEND_API_KEY is not set");
}

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
}

if (!process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY) {
  throw new Error("NEXT_PUBLIC_SUPABASE_SERVICE_KEY is not set");
}

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export const sendNewReservationEmailHost = async (reservation_id: number) => {
  const { data: reservation, error } = await getReservationById(reservation_id);

  if (error || !reservation) {
    console.error(error);
    return;
  }

  // get user email from profile
  //const host_profile = await getUserProfileById(reservation.listing?.host_id!);
  // TODO replace with real email

  const { data, error: authError } = await supabase.auth.admin.getUserById(
    reservation.listing?.host_id!
  );

  if (authError || !data) {
    console.error(authError);
    return;
  }

  const host = data.user;

  try {
    await resend.emails.send({
      from: "Booking <booking@namiokai.tech>",
      to: [host.email as string],
      subject: "Your listing has been booked",
      react: NewReservationEmailTemplate({
        reservation: reservation,
        host: host,
      }) as React.ReactElement,
    });
  } catch (error) {
    console.error(error);
  }
};
