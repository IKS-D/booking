import { z } from "zod";

export const UserRegistrationSchema = z
	.object({
		email: z.string().min(1, { message: "Email is required"}).email({ message: "Must be a valid email"}),
		password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
		confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters long" }),
	})
	.refine((data) => data.confirmPassword === data.password, {
		message: "Passwords must match",
		path: ["confirmPassword"],
	});

export type UserRegistrationFormData = z.infer<typeof UserRegistrationSchema>;