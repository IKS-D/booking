import { z } from "zod";

export const UserRegistrationSchema = z
	.object({
		email: z.string().email(),
		password: z.string().min(6, {
			message: "Password must be at least 6 characters long.",
		}),
		confirm: z.string().min(6, {
			message: "Password must be at least 6 characters long.",
		}),
	})
	.refine((data) => data.confirm === data.password, {
		message: "Passwords must match.",
		path: ["confirm"],
	});

export type UserRegistrationFormData = z.infer<typeof UserRegistrationSchema>;