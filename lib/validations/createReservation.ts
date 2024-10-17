import { z } from "zod";

export const CreateReservationSchema = z
  .object({
    start_date: z
      .date({ required_error: "Start date is required." })
      .refine((data) => data.getTime() >= new Date().setHours(0, 0, 0, 0), {
        message: "Start date must be today or in the future.",
      }),
    end_date: z
      .date({ required_error: "End date is required." })
      .refine((data) => data.getTime() >= new Date().setHours(0, 0, 0, 0), {
        message: "End date must be today or in the future.",
      }),
  })
  .refine((data) => data.start_date.getTime() < data.end_date.getTime(), {
    message: "End date must be after start date.",
    path: ["end_date"],
  });

export type CreateReservationFormData = z.infer<typeof CreateReservationSchema>;
