import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import supabase from "@/supabase/supabase";
import {
  getReservationById,
  insertReservation,
  updateReservationStatus,
  rejectReservation,
  confirmReservation,
  cancelReservation,
  insertOrderedServices,
  insertPayment,
} from "@/actions/reservations/reservationsQueries";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("Reservations Queries", () => {
  const testUserId = "32f8f198-a8c3-4dec-b5db-09d5daec2918";
  const testListingId = 1;
  const testOrderedServices = [{ service: 1 }];
  const testStartDate = "2023-01-01";
  const testEndDate = "2023-01-02";
  const testTotalPrice = 100;
  const testPayment = {
    amount: 100,
    date: new Date().toISOString(),
    first_name: "Test",
    last_name: "User",
    payer_email: "test@example.com",
    payment_method: "card",
    payment_number: "123456",
    reservation_id: 1,
    status: 1,
  };

  let reservationId: number;

  beforeEach(async () => {
    const { reservation } = await insertReservation({
      listingId: testListingId,
      userId: testUserId,
      orderedServices: [],
      startDate: testStartDate,
      endDate: testEndDate,
      totalPrice: testTotalPrice,
    });

    if (!reservation) {
      throw new Error("Error inserting reservation");
    }

    reservationId = reservation.id;
  });

  afterEach(async () => {
    await supabase.from("reservations").delete().eq("id", reservationId);
  });

  it("should fetch reservation by ID", async () => {
    const { data: fetchedReservation } = await getReservationById(
      reservationId
    );

    expect(fetchedReservation).toEqual(
      expect.objectContaining({ id: reservationId })
    );
  });

  it("should update reservation status", async () => {
    await updateReservationStatus(reservationId.toString(), 2);

    const { data: updatedReservation } = await getReservationById(
      reservationId
    );

    if (!updatedReservation) {
      throw new Error("Error fetching updated reservation status");
    }

    expect(updatedReservation.status.name).toBe("confirmed");
  });

  it("should reject reservation", async () => {
    await rejectReservation(reservationId.toString());

    const { data: rejectedReservation } = await getReservationById(
      reservationId
    );

    if (!rejectedReservation) {
      throw new Error("Error fetching rejected reservation");
    }

    expect(rejectedReservation.status.name).toBe("rejected");
  });

  it("should confirm reservation", async () => {
    await confirmReservation(reservationId.toString());

    const { data: confirmedReservation } = await getReservationById(
      reservationId
    );

    if (!confirmedReservation) {
      throw new Error("Error fetching confirmed reservation");
    }

    expect(confirmedReservation.status.name).toBe("confirmed");
  });

  it("should cancel reservation", async () => {
    await cancelReservation(reservationId.toString());

    const { data: canceledReservation } = await getReservationById(
      reservationId
    );

    if (!canceledReservation) {
      throw new Error("Error fetching canceled reservation");
    }

    expect(canceledReservation.status.name).toBe("cancelled");
  });

  it("should insert ordered services", async () => {
    await insertOrderedServices(reservationId, testOrderedServices);

    const { data: fetchedReservation } = await getReservationById(
      reservationId
    );

    if (!fetchedReservation) {
      throw new Error("Error fetching reservation");
    }

    expect(fetchedReservation.ordered_services).toHaveLength(
      testOrderedServices.length
    );
  });

  it("should insert payment", async () => {
    const { error } = await insertPayment(testPayment);
    expect(error).toBeNull();

    const { data: payments } = await supabase
      .from("payments")
      .select()
      .eq("payment_number", testPayment.payment_number);
    expect(payments).toHaveLength(1);

    await supabase
      .from("payments")
      .delete()
      .eq("payment_number", testPayment.payment_number);
  });
});
