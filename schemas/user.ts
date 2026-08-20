import { z } from "zod";
import {
	EMPTY_EMAIL_ERROR_MESSAGE,
	EMPTY_PASSWORD_ERROR_MESSAGE,
	EMPTY_USERNAME_ERROR_MESSAGE,
	NO_MATCHING_PASSWORDS_ERROR_MESSAGE,
} from "../constants.ts";
import {
	objectIdSchema,
	objectIdStringSchema,
	optionalObjectIdStringSchema,
} from "./mongodb.ts";
import { persistedRoleSchema } from "./role.ts";

const usernameSchema = z
	.string()
	.min(1, {
		message: EMPTY_USERNAME_ERROR_MESSAGE,
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

export const persistedUserSchema = z.object({
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
		role: persistedRoleSchema
			.transform((role) => role._id)
			.pipe(objectIdStringSchema),
	});

export type UpsertUserInput = z.output<typeof upsertUserRequestSchema>;
export type PersistedUser = z.output<typeof persistedUserSchema>;
export type UserResponse = z.output<typeof userResponseSchema>;
