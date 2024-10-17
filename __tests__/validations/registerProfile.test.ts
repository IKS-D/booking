import { ProfileRegistrationSchema } from "@/lib/validations/registerProfile";
import { describe, it, expect } from "vitest";

const defaultValidProfile = Object.freeze({
  firstName: "John",
  lastName: "Doe",
  dateOfBirth: new Date(2000, 1, 1),
  phoneNumber: "+1234567890",
  country: "USA",
  city: "New York",
  photo: "http://example.com/photo.jpg",
});

describe("ProfileRegistrationSchema", () => {
  it("should validate a correct profile", () => {
    const validProfile = defaultValidProfile;

    expect(() => ProfileRegistrationSchema.parse(validProfile)).not.toThrow();
  });

  it("should invalidate a profile with missing first name", () => {
    const invalidProfile = {
      ...defaultValidProfile,
      firstName: "",
    };

    expect(() => ProfileRegistrationSchema.parse(invalidProfile)).toThrow(
      "First name is required"
    );
  });

  it("should invalidate a profile with too long first name", () => {
    const invalidProfile = {
      ...defaultValidProfile,
      firstName: "A".repeat(31),
    };

    expect(() => ProfileRegistrationSchema.parse(invalidProfile)).toThrow(
      "First name cannot be longer than 30 characters"
    );
  });

  it("should invalidate a profile with invalid date of birth", () => {
    const invalidProfile = {
      ...defaultValidProfile,
      dateOfBirth: new Date("invalid-date"),
    };

    expect(() => ProfileRegistrationSchema.parse(invalidProfile)).toThrow(
      "Invalid date"
    );
  });

  it("should invalidate a profile with underage date of birth", () => {
    const invalidProfile = {
      ...defaultValidProfile,
      dateOfBirth: new Date(),
    };

    expect(() => ProfileRegistrationSchema.parse(invalidProfile)).toThrow(
      "You must be at least 18 years old to register"
    );
  });

  it("should invalidate a profile with invalid phone number", () => {
    const invalidProfile = {
      ...defaultValidProfile,
      phoneNumber: "123",
    };

    expect(() => ProfileRegistrationSchema.parse(invalidProfile)).toThrow(
      "Invalid phone number"
    );
  });

  it("should invalidate a profile with invalid photo URL", () => {
    const invalidProfile = {
      ...defaultValidProfile,
      photo: "invalid-url",
    };

    expect(() => ProfileRegistrationSchema.parse(invalidProfile)).toThrow(
      "Invalid URL"
    );
  });

  it("should validate a profile with exactly 18 years old today", () => {
    const today = new Date();
    const eighteenYearsAgo = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );

    const validProfile = {
      ...defaultValidProfile,
      dateOfBirth: eighteenYearsAgo,
    };

    expect(() => ProfileRegistrationSchema.parse(validProfile)).not.toThrow();
  });

  it("should validate a profile with older than 18 years", () => {
    const validProfile = {
      ...defaultValidProfile,
      dateOfBirth: new Date(2000, 1, 1),
    };

    expect(() => ProfileRegistrationSchema.parse(validProfile)).not.toThrow();
  });

  it("should invalidate a profile with younger than 18 years", () => {
    const today = new Date();
    const seventeenYearsAgo = new Date(
      today.getFullYear() - 17,
      today.getMonth(),
      today.getDate()
    );

    const invalidProfile = {
      ...defaultValidProfile,
      dateOfBirth: seventeenYearsAgo,
    };

    expect(() => ProfileRegistrationSchema.parse(invalidProfile)).toThrow(
      "You must be at least 18 years old to register"
    );
  });

  it("should invalidate a profile with exactly 18 years old but month is earlier", () => {
    const today = new Date();
    const eighteenYearsAgo = new Date(
      today.getFullYear() - 18,
      today.getMonth() + 1,
      today.getDate()
    );

    const invalidProfile = {
      ...defaultValidProfile,
      dateOfBirth: eighteenYearsAgo,
    };

    expect(() => ProfileRegistrationSchema.parse(invalidProfile)).toThrow(
      "You must be at least 18 years old to register"
    );
  });

  it("should invalidate a profile with exactly 18 years old but day is earlier", () => {
    const today = new Date();
    const eighteenYearsAgo = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate() + 1
    );

    const invalidProfile = {
      ...defaultValidProfile,
      dateOfBirth: eighteenYearsAgo,
    };

    expect(() => ProfileRegistrationSchema.parse(invalidProfile)).toThrow(
      "You must be at least 18 years old to register"
    );
  });

  it("should validate a profile with exactly 18 years old but month is later", () => {
    const today = new Date();
    const eighteenYearsAgo = new Date(
      today.getFullYear() - 18,
      today.getMonth() - 1,
      today.getDate()
    );

    const validProfile = {
      ...defaultValidProfile,
      dateOfBirth: eighteenYearsAgo,
    };

    expect(() => ProfileRegistrationSchema.parse(validProfile)).not.toThrow();
  });
});
