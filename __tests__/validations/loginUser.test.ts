import { describe, it, expect } from "vitest";
import { loginUserSchema } from "../../lib/validations/loginUser";

describe("loginUserSchema", () => {
  it("should validate a correct email and password", () => {
    const result = loginUserSchema.safeParse({
      email: "test@example.com",
      password: "password123",
    });

    expect(result.success).toBe(true);
  });

  it("should invalidate an incorrect email", () => {
    const result = loginUserSchema.safeParse({
      email: "invalid-email",
      password: "password123",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.errors[0].message).toBe("Please enter a valid email");
    }
  });

  it("should invalidate a short password", () => {
    const result = loginUserSchema.safeParse({
      email: "test@example.com",
      password: "short",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.errors[0].message).toBe(
        "Password must be at least 8 characters"
      );
    }
  });

  it("should invalidate missing email", () => {
    const result = loginUserSchema.safeParse({
      password: "password123",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.errors[0].message).toBe("Required");
    }
  });

  it("should invalidate missing password", () => {
    const result = loginUserSchema.safeParse({
      email: "test@example.com",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.errors[0].message).toBe("Required");
    }
  });
});
