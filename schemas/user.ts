import { z } from "zod";
import { objectIdSchema } from "./mongodb.ts";
import { roleSchema } from "./role.ts";

export const userSchema = z.object({
	_id: objectIdSchema,
	username: z.string().min(1).meta({
		type: "string",
		example: "john_doe",
	}),
	email: z.email(),
	role: roleSchema,
	password: z.string().min(1).meta({
		type: "string",
		example: "password123",
	}),
	dateCreated: z.date(),
});

export const userResponseSchema = userSchema.omit({ password: true }).extend({
	role: roleSchema
		.transform((role) => role.name)
		.meta({
			type: "string",
			example: "admin",
		}),
});
