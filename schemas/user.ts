import { z } from "zod";
import { EMPTY_PASSWORD_ERROR_MESSAGE } from "../constants.ts";
import {
	objectIdSchema,
	objectIdStringSchema,
	optionalObjectIdStringSchema,
} from "./mongodb.ts";
import { persistedRoleSchema } from "./role.ts";

const usernameSchema = z
	.string()
	.min(1, {
		message: "Username cannot be empty",
	})
	.meta({
		type: "string",
		example: "john_doe",
	});

export const passwordSchema = z.string().meta({
	type: "string",
	example: "password123",
});

export const upsertUserRequestSchema = z
	.object({
		_id: optionalObjectIdStringSchema,
		username: usernameSchema,
		email: z.email().min(1, { message: "Email cannot be empty" }),
		role: objectIdStringSchema,
		password: passwordSchema.optional(),
		confirmPassword: passwordSchema.optional(),
		dateCreated: z.date().optional(),
	})
	.superRefine((data, ctx) => {
		if (data.password !== data.confirmPassword) {
			ctx.addIssue({
				code: "custom",
				message: "No matching passwords",
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

const persistedUserSchema = z.object({
	_id: objectIdSchema,
	username: usernameSchema,
	email: z.email(),
	role: persistedRoleSchema,
	password: passwordSchema,
	dateCreated: z.date(),
	systemManaged: z.boolean().optional(),
});

export const userResponseSchema = persistedUserSchema
	.omit({ password: true })
	.extend({
		role: persistedRoleSchema.pick({ _id: true, name: true }),
	});

export type UpsertUserInput = z.output<typeof upsertUserRequestSchema>;
export type PersistedUser = z.output<typeof persistedUserSchema>;
