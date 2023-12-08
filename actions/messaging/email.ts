"use server";

import { NewMessageEmailTemplate } from "../../components/email/NewMessageEmailTemplate";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { getUserProfileById } from "../users/usersQueries";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceRoleKey =
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY || "";
const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
}
if (!process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY) {
  throw new Error("NEXT_PUBLIC_SUPABASE_SERVICE_KEY is not set");
}
if (!process.env.NEXT_PUBLIC_RESEND_API_KEY) {
  throw new Error("NEXT_PUBLIC_RESEND_API_KEY is not set");
}

export const sendNewMessageEmail = async (
  user_id: string,
  sent_time: string,
  text: string,
  sender_id: string,
  received_id: string,
  reservation_id: number
) => {
  try {
    const userEmail = await fetchUserEmail(user_id);
    const to = userEmail.user?.email || "";

    const { data: senderProfile } = await getUserProfileById(user_id);
    const { data: ReceiverProfile } = await getUserProfileById(
      received_id.toString()
    );

    const response = await resend.emails.send({
      from: "Booking <booking@namiokai.tech>",
      to: to,
      subject: "You have a new message",
      react: NewMessageEmailTemplate({
        reservation_id,
        text,
        sent_time,
        sender: senderProfile?.first_name + " " + senderProfile?.last_name,
        receiver:
          ReceiverProfile?.first_name + " " + ReceiverProfile?.last_name,
      }) as React.ReactElement,
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};

async function fetchUserEmail(userId: string) {
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data, error } = await supabase.auth.admin.getUserById(userId);

  return data;
}
