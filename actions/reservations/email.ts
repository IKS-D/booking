"use server";

import { HostNewReservationEmailTemplate } from "../../components/email/HostNewReservationEmailTemplate";
import { Resend } from "resend";
import { getReservationById } from "./reservationsQueries";
import { createClient } from "@supabase/supabase-js";

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
    return { error: new Error("Failed to fetch reservation") };
  }

  const { data, error: authError } = await supabase.auth.admin.getUserById(
    reservation.listing?.host_id!
  );

  /* v8 ignore next 3 */
  if (authError || !data) {
    return { error: new Error("Failed to fetch user") };
  }

  const host = data.user;

  try {
    await resend.emails.send({
      from: "Booking <booking@namiokai.tech>",
      to: [host.email as string],
      subject: "Your listing has been booked",
      react: HostNewReservationEmailTemplate({
        reservation: reservation,
        host: host,
      }) as React.ReactElement,
    });
    /* v8 ignore next 3 */
  } catch (error) {
    return { error: new Error("Failed to send email") };
  }
};
