import {
  buildPayseraPaymentLink,
  decodePayseraData,
  md5,
} from "@/actions/reservations/payseraAPI";
import { describe, it, expect, beforeAll } from "vitest";

beforeAll(() => {
  process.env.NEXT_PUBLIC_PAYSERA_PASSWORD = "testpassword";
});

describe("md5", () => {
  it("should correctly hash a given string", () => {
    const hash = md5("test");
    expect(hash).toBe("098f6bcd4621d373cade4e832627b4f6");
  });
});

describe("buildPayseraPaymentLink", () => {
  it("should build a payment link with default parameters", () => {
    const link = buildPayseraPaymentLink({});

    expect(link).toContain("https://www.paysera.com/pay/");
    expect(link).toContain("data=");
    expect(link).toContain("sign=");
  });

  it.each([
    { amount: 1000, orderId: 4 },
    { amount: 2000, orderId: 5 },
    { amount: 358, orderId: 6 },
  ])(
    "should build a payment link with custom parameters",
    ({ amount, orderId }) => {
      const link = buildPayseraPaymentLink({
        amount: amount.toString(),
        orderid: orderId.toString(),
      });

      const url = new URL(link);
      const data = url.searchParams.get("data") || "";
      const ss1 = url.searchParams.get("sign") || "";
      const ss2 = url.searchParams.get("sign2") || "";

      const decodedPayment = decodePayseraData(data, ss1, ss2);

      expect(decodedPayment).toHaveProperty("amount");
      expect(decodedPayment).toHaveProperty("reservation_id");

      expect(decodedPayment.amount).toBe(amount);
      expect(decodedPayment.reservation_id).toBe(orderId);
    }
  );

  it("should throw an error if password is missing", () => {
    delete process.env.NEXT_PUBLIC_PAYSERA_PASSWORD;

    expect(() => buildPayseraPaymentLink({})).toThrow(
      "Paysera Project Password not found"
    );
  });
});

describe("decodePayseraData", () => {
  beforeAll(() => {
    process.env.NEXT_PUBLIC_PAYSERA_PASSWORD = "testpassword";
  });

  it("should decode valid data and return payment object", () => {
    const data = "dGVzdGRhdGE=";
    const ss1 = md5(data + "testpassword");
    const payment = decodePayseraData(data, ss1, "");

    expect(payment).toHaveProperty("amount");
    expect(payment).toHaveProperty("date");
    expect(payment).toHaveProperty("first_name");
    expect(payment).toHaveProperty("last_name");
    expect(payment).toHaveProperty("payer_email");
    expect(payment).toHaveProperty("payment_method");
    expect(payment).toHaveProperty("payment_number");
    expect(payment).toHaveProperty("reservation_id");
    expect(payment).toHaveProperty("status");
  });

  it("should throw an error if ss1 does not match", () => {
    const data = "dGVzdGRhdGE=";
    const ss1 = "invalidss1";

    expect(() => decodePayseraData(data, ss1, "")).toThrow(
      "ss1 does not match. Possible data corruption"
    );
  });

  it("should throw an error if password is missing", () => {
    delete process.env.NEXT_PUBLIC_PAYSERA_PASSWORD;

    expect(() => decodePayseraData("data", "ss1", "")).toThrow(
      "Paysera Project Password not found"
    );
  });
});
