import { z } from "zod";
import { objectIdSchema, optionalObjectIdStringSchema } from "./mongodb.ts";

const baseRoleSchema = z.object({
	name: z.string().min(1, { message: "Name cannot be empty" }),
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
export type PersistedRole = z.output<typeof persistedRoleSchema>;
