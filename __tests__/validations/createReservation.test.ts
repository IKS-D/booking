import { describe, it, expect } from "vitest";
import { CreateReservationSchema } from "../../lib/validations/createReservation";

const getFutureDate = (daysFromToday: number) =>
  new Date(new Date().setDate(new Date().getDate() + daysFromToday));

const getPastDate = (daysFromToday: number) =>
  new Date(new Date().setDate(new Date().getDate() - daysFromToday));

describe("CreateReservationSchema", () => {
  it("should pass validation with valid dates", () => {
    const validData = {
      start_date: getFutureDate(1),
      end_date: getFutureDate(2),
    };

    expect(() => CreateReservationSchema.parse(validData)).not.toThrow();
  });

  it("should fail validation if start_date is in the past", () => {
    const invalidData = {
      start_date: getPastDate(1),
      end_date: getFutureDate(1),
    };

    expect(() => CreateReservationSchema.parse(invalidData)).toThrow(
      "Start date must be today or in the future."
    );
  });

  it("should fail validation if end_date is in the past", () => {
    const invalidData = {
      start_date: getFutureDate(1),
      end_date: getPastDate(1),
    };

    expect(() => CreateReservationSchema.parse(invalidData)).toThrow(
      "End date must be today or in the future."
    );
  });

  it("should fail validation if end_date is before start_date", () => {
    const invalidData = {
      start_date: getFutureDate(2),
      end_date: getFutureDate(1),
    };

    expect(() => CreateReservationSchema.parse(invalidData)).toThrow(
      "End date must be after start date."
    );
  });
});
