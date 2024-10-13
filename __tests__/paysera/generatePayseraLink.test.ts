import { describe, it, expect, vi } from "vitest";
import { buildPayseraPaymentLink } from "@/actions/reservations/payseraAPI";
import { headers } from "next/headers";
import { createPayment } from "@/actions/reservations/generatePayseraLink";
import { getUserProfileById } from "@/actions/users/usersQueries";

const mockUserProfile = {
  first_name: "John",
  last_name: "Doe",
  birth_date: "1990-01-01",
  city: "New York",
  country: "USA",
  id: "user123",
  phone: "1234567890",
  photo: "http://iksd.com/photo.jpg",
};

const mockHeaders = {
  get: vi.fn().mockReturnValue("localhost"),
  append: vi.fn(),
  delete: vi.fn(),
  getSetCookie: vi.fn(),
  has: vi.fn(),
  set: vi.fn(),
  forEach: vi.fn(),
  entries: vi.fn(),
  keys: vi.fn(),
  values: vi.fn(),
  [Symbol.iterator]: vi.fn(),
};

vi.mock("@/actions/reservations/payseraAPI", () => ({
  buildPayseraPaymentLink: vi.fn(),
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(),
}));

vi.mock("@/actions/users/usersQueries", () => ({
  getUserProfileById: vi.fn(),
}));

describe("createPayment", () => {
  it("should create a payment link", async () => {
    vi.mocked(headers).mockReturnValue(mockHeaders);

    vi.mocked(getUserProfileById).mockResolvedValue({
      data: mockUserProfile,
      error: null,
    });

    vi.mocked(buildPayseraPaymentLink).mockReturnValue(
      "http://iksd.com/payment-link"
    );

    process.env.NEXT_PUBLIC_PAYSERA_CALLBACK_URL = "http://iksd.com/callback";

    const link = await createPayment(1000, 1, "user123");

    expect(link).toBe("http://iksd.com/payment-link");

    expect(buildPayseraPaymentLink).toHaveBeenCalledWith({
      orderid: "1",
      amount: "1000",
      p_firstname: "John",
      p_lastname: "Doe",
      accepturl: "http://localhost/payment/success",
      cancelurl: "http://localhost/payment/cancel",
      callbackurl: "http://iksd.com/callback",
    });
  });

  it("should throw an error if NEXT_PUBLIC_PAYSERA_CALLBACK_URL is not defined", async () => {
    delete process.env.NEXT_PUBLIC_PAYSERA_CALLBACK_URL;

    await expect(createPayment(1000, 1, "user123")).rejects.toThrow(
      "NEXT_PUBLIC_PAYSERA_CALLBACK_URL not found"
    );
  });
});
