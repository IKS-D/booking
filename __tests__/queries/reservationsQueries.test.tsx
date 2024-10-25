import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import supabase from "@/supabase/client";
import {
  getReservationById,
  insertReservation,
  updateReservationStatus,
  rejectReservation,
  confirmReservation,
  cancelReservation,
  insertOrderedServices,
  insertPayment,
  getHostReservations,
  getReservations,
} from "@/actions/reservations/reservationsQueries";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("Reservations Queries", () => {
  const testUserId = "32f8f198-a8c3-4dec-b5db-09d5daec2918";
  const testListingId = 1;
  const testOrderedService = { service: 2 };
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
    const { reservation, error } = await insertReservation({
      listingId: testListingId,
      userId: testUserId,
      orderedServices: [
        {
          service: 1,
        },
      ],
      startDate: testStartDate,
      endDate: testEndDate,
      totalPrice: testTotalPrice,
    });

    expect(error).toBeNull();
    expect(reservation).not.toBeNull();

    if (!reservation) {
      throw new Error("Error inserting reservation");
    }

    reservationId = reservation.id;
  });

  afterEach(async () => {
    await supabase.from("reservations").delete().eq("id", reservationId);
  });

  it("should fetch user reservations", async () => {
    const { data: reservations, error } = await getReservations(testUserId);

    expect(error).toBeNull();
    expect(reservations).length.greaterThanOrEqual(1);
  });

  it("should return error for fetching invalid user reservations", async () => {
    const { data: reservations, error } = await getReservations("invalid-id");

    expect(error).not.toBeNull();
    expect(reservations).toBeNull();
  });

  it("should fetch host reservations", async () => {
    const { data: reservations, error } = await getHostReservations(testUserId);

    expect(error).toBeNull();
    expect(reservations).length.greaterThanOrEqual(0);
  });

  it("should return error for fetching invalid host reservations", async () => {
    const { data: reservations, error } = await getHostReservations(
      "invalid-id"
    );

    expect(error).not.toBeNull();
    expect(reservations).toBeNull();
  });

  it("should fetch reservation by ID", async () => {
    const { data: fetchedReservation, error } = await getReservationById(
      reservationId
    );

    expect(fetchedReservation).toEqual(
      expect.objectContaining({ id: reservationId })
    );
    expect(error).toBeNull();
  });

  it("should return error for fetching invalid reservation by ID", async () => {
    const { data: fetchedReservation, error } = await getReservationById(-1);

    expect(fetchedReservation).toBeNull();
    expect(error).not.toBeNull();
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
    await insertOrderedServices(reservationId, [testOrderedService]);

    const { data: fetchedReservation } = await getReservationById(
      reservationId
    );

    if (!fetchedReservation) {
      throw new Error("Error fetching reservation");
    }

    expect(fetchedReservation.ordered_services).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          service: expect.objectContaining({
            id: testOrderedService.service,
          }),
        }),
      ])
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
