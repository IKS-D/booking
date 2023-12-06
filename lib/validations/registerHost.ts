import { z } from "zod";

export const HostRegistrationSchema = z
	.object({
		personalCode: z.string(),
		bankAccount: z.string(),
	});

export type HostRegistrationFormData = z.infer<typeof HostRegistrationSchema>;