import z, { email } from "zod"


export const signupSchema = z.object({
	email: z.email(),
	password: z.string().min(8).max(128).regex(
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
		"Password must contain uppercase, lowercase, number, and special character"
	),
	name: z.string().min(2).max(50).optional(),
	avatarUrl: z.url().optional()


})

export const loginSchema = z.object({
	email: z.email(),
	password: z.string().min(8).max(128).regex(
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
		"Password must contain uppercase, lowercase, number, and special character"
	),
})