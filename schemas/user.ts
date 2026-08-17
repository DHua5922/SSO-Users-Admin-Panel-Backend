import { z } from "zod";
import {
	EMPTY_EMAIL_ERROR_MESSAGE,
	EMPTY_PASSWORD_ERROR_MESSAGE,
	EMPTY_USERNAME_ERROR_MESSAGE,
	NO_MATCHING_PASSWORDS_ERROR_MESSAGE,
} from "../constants.ts";
import { objectIdSchema, objectIdStringSchema } from "./mongodb.ts";
import { roleSchema } from "./role.ts";

const usernameSchema = z
	.string()
	.min(1, {
		message: EMPTY_USERNAME_ERROR_MESSAGE,
	})
	.meta({
		type: "string",
		example: "john_doe",
	});

const passwordSchema = z.string().meta({
	type: "string",
	example: "password123",
});

export const upsertUserServiceInputSchema = z
	.object({
		_id: objectIdStringSchema.optional(),
		username: usernameSchema,
		email: z.email().min(1, {
			message: EMPTY_EMAIL_ERROR_MESSAGE,
		}),
		role: objectIdStringSchema,
		password: passwordSchema.optional(),
		confirmPassword: passwordSchema.optional(),
		dateCreated: z.date().optional(),
	})
	.superRefine((data, ctx) => {
		if (data.password !== data.confirmPassword) {
			ctx.addIssue({
				code: "custom",
				message: NO_MATCHING_PASSWORDS_ERROR_MESSAGE,
				path: ["confirmPassword"],
			});
		}

		if (!data._id && !data.password?.trim()) {
			ctx.addIssue({
				code: "custom",
				message: EMPTY_PASSWORD_ERROR_MESSAGE,
				path: ["password"],
			});
		}
	});

export const userSchema = z.object({
	_id: objectIdSchema,
	username: usernameSchema,
	email: z.email(),
	role: roleSchema,
	password: passwordSchema,
	dateCreated: z.date(),
});

export const userResponseSchema = userSchema.omit({ password: true }).extend({
	role: roleSchema
		.transform((role) => role._id)
		.meta({
			type: "string",
			example: "66b55fc95c67d15013a5f101",
		}),
});

export type UpsertUserServiceInput = z.infer<
	typeof upsertUserServiceInputSchema
>;

export type User = z.infer<typeof userSchema>;
