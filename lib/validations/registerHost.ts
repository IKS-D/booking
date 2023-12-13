import { z } from "zod";

export const HostRegistrationSchema = z
	.object({
		personalCode: z.string()
		.min(1, {message: "Personal code is required"})
		.max(30, {message: "Personal code cannot be longer than 30 characters"}),
		bankAccount: z.string()
		.min(1, {message: "Bank account is required"})
		.max(30, {message: "Bank account cannot be longer than 30 characters"}),
	});

export type HostRegistrationFormData = z.infer<typeof HostRegistrationSchema>;