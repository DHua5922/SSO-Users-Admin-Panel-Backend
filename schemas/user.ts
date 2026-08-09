import { z } from "zod";
import { objectIdSchema } from "./mongodb.ts";

export const userSchema = z.object({
	_id: objectIdSchema,
	username: z.string().min(1).meta({
		type: "string",
		example: "john_doe",
	}),
	email: z.email(),
	role: objectIdSchema,
	password: z.string().min(1).meta({
		type: "string",
		example: "password123",
	}),
	dateCreated: z.date(),
});
