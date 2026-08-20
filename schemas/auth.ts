import { z } from "zod";
import { passwordSchema } from "./user.ts";

export const loginRequestBodySchema = z.object({
	email: z.email(),
	password: passwordSchema,
});
