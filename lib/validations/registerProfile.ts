import { z } from "zod";

export const ProfileRegistrationSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .max(30, { message: "First name cannot be longer than 30 characters" }),
  lastName: z
    .string()
    .min(1, { message: "Last name is required" })
    .max(30, { message: "Last name cannot be longer than 30 characters" }),
  dateOfBirth: z
    .date({
      required_error: "Date of birth is required",
      invalid_type_error: "Invalid date",
    })
    .refine((date) => date.toDateString() !== "Invalid date", {
      message: "Invalid date",
    })
    .refine((date) => validateAge(date), {
      message: "You must be at least 18 years old to register",
    }),
  phoneNumber: z
    .string()
    .min(1, { message: "Phone number is required" })
    .max(20, { message: "Phone number cannot be longer than 20 characters" })
    .refine((phoneNumber) => validatePhone(phoneNumber), {
      message: "Invalid phone number",
    }),
  country: z.string().min(1, { message: "Country is required" }),
  city: z.string().min(1, { message: "City is required" }),
  photo: z
    .string()
    .min(1, { message: "Photo is required" })
    .refine((photo) => validateUrl(photo), {
      message: "Invalid URL",
    }),
});

const validateUrl = (photo: string) => {
  try {
    new URL(photo);
    return true;
  } catch {
    return false;
  }
};

const validateAge = (dateOfBirth: Date) => {
  const today = new Date();

  const diffInYears = today.getFullYear() - dateOfBirth.getFullYear();

  if (diffInYears > 18) {
    return true;
  }

  if (diffInYears < 18) {
    return false;
  }

  if (diffInYears == 18) {
    const diffInMonths = today.getMonth() - dateOfBirth.getMonth();

    if (diffInMonths > 0) {
      return true;
    }

    if (diffInMonths < 0) {
      return false;
    }

    if (diffInMonths == 0) {
      const diffInDays = today.getDate() - dateOfBirth.getDate();

      if (diffInDays >= 0) {
        return true;
      }
      return false;
    }
  } 
};

const validatePhone = (phoneNumber: string) => {
  // Regular expression for a valid phone number
  const phoneRegex = /^\+?[0-9]{10,}$/;
  return phoneRegex.test(phoneNumber);
};

export type ProfileRegistrationFormData = z.infer<
  typeof ProfileRegistrationSchema
>;
