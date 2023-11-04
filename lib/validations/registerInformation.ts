import { z } from "zod";

export const registerInformationSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  dateOfBirth: z.string(), // need to change to date
  phone: z.string(),
  picture: z.string(),
  country: z.string(),
  city: z.string(),
});

export type RegisterInformationFormData = z.infer<typeof registerInformationSchema>;