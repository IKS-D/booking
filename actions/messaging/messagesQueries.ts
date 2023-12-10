"use server";

import supabase from "@/supabase/supabase";
import { sendNewMessageEmail } from "./email";
import getCurrentUser, {
  getHostIdByReservationId,
} from "../users/usersQueries";

export async function getMessagesForCurrentUser(reservationId: number) {
  const currentUser = await getCurrentUser();

  if (!currentUser || !currentUser.id) {
    return null;
  }
  const reservation = await getUserIdFromReservation(reservationId);
  if (!reservation) {
    return null;
  }

  let { data: messages, error } = await supabase
    .from("messages")
    .select("*")
    .filter("reservation_id", "eq", reservationId)
    .or(`sender_id.eq.${currentUser.id},received_id.eq.${currentUser.id}`);

  if (error) {
    console.error(error);
    return null;
  }

  return { data: messages, error: error };
}

export async function insertMessage({
  text,
  reservationId,
}: {
  text: string;
  reservationId: number;
}) {
  const { user_id: guestId } = await getUserIdFromReservation(reservationId);

  if (!guestId) {
    console.error("Reservation not found or error fetching reservation");
    return null;
  }

  const sender = await getCurrentUser();
  const { data: hostId } = await getHostIdByReservationId(reservationId);

  const receiverId = sender?.id === hostId ? guestId : hostId;

  if (!receiverId) {
    console.error("Receiver not found or error fetching receiver");
    return null;
  }

  let { error } = await supabase.from("messages").insert([
    {
      sent_time: new Date().toISOString(),
      text: text,
      sender_id: sender?.id ?? "",
      received_id: receiverId ?? "",
      reservation_id: reservationId,
    },
  ]);

  if (receiverId != null && sender != null)
    sendNewMessageEmail(
      receiverId,
      new Date().toISOString(),
      text,
      sender?.id,
      receiverId,
      reservationId
    );

  if (error) {
    console.error(error);
    return null;
  }
}

export async function getUserIdFromReservation(reservationId: number) {
  let { data: reservation, error } = await supabase
    .from("reservations")
    .select("user_id")
    .eq("id", reservationId)
    .limit(1)
    .single();

  if (error) {
    console.error(error);
    return { user_id: null, error: error };
  }

  return { user_id: reservation?.user_id, error: null };
}

export async function updateMessageText({
  messageId,
  newText,
}: {
  messageId: number;
  newText: string;
}) {
  const { data, error } = await supabase
    .from("messages")
    .update({ text: newText })
    .match({ id: messageId });

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}

export async function deleteMessage(messageId: number) {
  const currentUser = await getCurrentUser();

  if (!currentUser || !currentUser.id) {
    return null;
  }

  const { data, error } = await supabase
    .from("messages")
    .delete()
    .match({ id: messageId });

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}

export async function getMessageById(messageId: number) {
  const currentUser = await getCurrentUser();

  if (!currentUser || !currentUser.id) {
    return null;
  }

  const { data: message, error } = await supabase
    .from("messages")
    .select("*")
    .eq("id", messageId)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return { data: message, error: error };
}
