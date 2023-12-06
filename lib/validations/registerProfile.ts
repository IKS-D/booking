import { z } from "zod";

export const ProfileRegistrationSchema = z
  .object({
    firstName: z.string()
      .max(20, { message: "First name can be 20 characters max" })
      .min(1, { message: "You must at least enter an initial" }),
    lastName: z.string()
      .max(20, { message: "Last name can be 30 characters max" })
      .min(1, { message: "You must at least enter an initial" }),
    dateOfBirth: z.date(),
    phoneNumber: z.string().max(20, { message: "Phone number can be 20 characters max" }),
    country: z.string(),
    city: z.string(),
    photo: z.string()
  })
  .refine((data) => (Date.now() - new Date(data.dateOfBirth).getTime()) >= 18 * 365.25 * 24 * 60 * 60 * 1000, {
    message: "You must be at least 18 years old to register.",
    path: ["dateOfBirth"],
  })
  .refine((data) => {
    try {
      new URL(data.photo);
      return true;
    } catch (error) {
      return false;
    }
  }, {
    message: "Invalid URL",
    path: ["photo"]
  });

export type ProfileRegistrationFormData = z.infer<typeof ProfileRegistrationSchema>;