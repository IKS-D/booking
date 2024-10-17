import { describe, it, expect } from "vitest";
import { UserRegistrationSchema } from "../../lib/validations/registerUser";

const defaultValidUser = Object.freeze({
  email: "test@example.com",
  password: "password123",
  confirmPassword: "password123",
});

describe("UserRegistrationSchema", () => {
  it("should pass validation with valid data", () => {
    const validData = defaultValidUser;

    expect(() => UserRegistrationSchema.parse(validData)).not.toThrow();
  });

  it("should fail validation if email is missing", () => {
    const invalidData = {
      ...defaultValidUser,
      email: "",
    };

    expect(() => UserRegistrationSchema.parse(invalidData)).toThrow(
      "Email is required"
    );
  });

  it("should fail validation if email is invalid", () => {
    const invalidData = {
      ...defaultValidUser,
      email: "invalid-email",
    };

    expect(() => UserRegistrationSchema.parse(invalidData)).toThrow(
      "Must be a valid email"
    );
  });

  it("should fail validation if password is less than 6 characters", () => {
    const invalidData = {
      ...defaultValidUser,
      password: "123",
      confirmPassword: "123",
    };

    expect(() => UserRegistrationSchema.parse(invalidData)).toThrow(
      "Password must be at least 6 characters long"
    );
  });

  it("should fail validation if passwords do not match", () => {
    const invalidData = {
      ...defaultValidUser,
      password: "password123",
      confirmPassword: "differentPassword",
    };

    expect(() => UserRegistrationSchema.parse(invalidData)).toThrow(
      "Passwords must match"
    );
  });
});
