import { z } from "zod";
import { passwordSchema } from "./user.ts";

export const loginRequestSchema = z.object({
	email: z.email(),
	password: passwordSchema,
});
