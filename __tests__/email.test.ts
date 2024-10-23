import { sendNewReservationEmailHost } from "@/actions/reservations/email";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getReservationById } from "@/actions/reservations/reservationsQueries";

vi.mock("@/actions/reservations/reservationsQueries");
vi.mock("@supabase/supabase-js");
vi.mock("resend");

describe("Email Tests", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return error failed to fetch reservation", async () => {
    vi.mocked(getReservationById).mockResolvedValue({
      data: null,
      error: {
        message: "Failed to fetch reservation",
        details: "",
        hint: "",
        code: "P0001",
      },
    });

    const result = await sendNewReservationEmailHost(-200);

    if (!result?.error) {
      throw new Error("Expected error, but none was thrown");
    }

    const error = result.error;

    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe("Failed to fetch reservation");
  });
});
