import { z } from "zod";
import { EMPTY_ROLE_NAME_ERROR_MESSAGE } from "../constants.ts";
import { objectIdSchema, optionalObjectIdStringSchema } from "./mongodb.ts";

const baseRoleSchema = z.object({
	name: z.string().min(1, { message: EMPTY_ROLE_NAME_ERROR_MESSAGE }),
	description: z.string(),
});

export const roleResponseSchema = baseRoleSchema.extend({
	_id: objectIdSchema,
	systemManaged: z.boolean().optional(),
});

export const persistedRoleSchema = roleResponseSchema.extend({
	key: z.string(),
});

export const upsertRoleRequestSchema = baseRoleSchema.extend({
	_id: optionalObjectIdStringSchema,
});

export type UpsertRoleInput = z.output<typeof upsertRoleRequestSchema>;
export type RoleResponse = z.output<typeof roleResponseSchema>;
export type PersistedRole = z.output<typeof persistedRoleSchema>;
