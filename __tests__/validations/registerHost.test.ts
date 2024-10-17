import { describe, it, expect } from "vitest";
import { HostRegistrationSchema } from "../../lib/validations/registerHost";

describe("HostRegistrationSchema", () => {
  it("should pass validation for valid data", () => {
    const validData = {
      personalCode: "1234567890",
      bankAccount: "12345678901234567890",
    };

    const result = HostRegistrationSchema.safeParse(validData);

    expect(result.success).toBe(true);
  });

  it("should fail validation if personalCode is empty", () => {
    const invalidData = {
      personalCode: "",
      bankAccount: "12345678901234567890",
    };

    const result = HostRegistrationSchema.safeParse(invalidData);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.errors[0].message).toBe("Personal code is required");
    }
  });

  it("should fail validation if personalCode is longer than 30 characters", () => {
    const invalidData = {
      personalCode: "a".repeat(31),
      bankAccount: "12345678901234567890",
    };

    const result = HostRegistrationSchema.safeParse(invalidData);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.errors[0].message).toBe(
        "Personal code cannot be longer than 30 characters"
      );
    }
  });

  it("should fail validation if bankAccount is empty", () => {
    const invalidData = {
      personalCode: "1234567890",
      bankAccount: "",
    };

    const result = HostRegistrationSchema.safeParse(invalidData);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.errors[0].message).toBe("Bank account is required");
    }
  });

  it("should fail validation if bankAccount is longer than 30 characters", () => {
    const invalidData = {
      personalCode: "1234567890",
      bankAccount: "a".repeat(31),
    };

    const result = HostRegistrationSchema.safeParse(invalidData);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.errors[0].message).toBe(
        "Bank account cannot be longer than 30 characters"
      );
    }
  });
});
