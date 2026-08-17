import { z } from "zod";
import { EMPTY_ROLE_NAME_ERROR_MESSAGE } from "../constants.ts";
import { objectIdSchema, objectIdStringSchema } from "./mongodb.ts";

const nameSchema = z
	.string()
	.min(1, { message: EMPTY_ROLE_NAME_ERROR_MESSAGE });

const baseRoleSchema = z.object({
	name: nameSchema,
	description: z.string(),
});

export const roleSchema = baseRoleSchema.extend({
	_id: objectIdSchema,
});

export const upsertRoleServiceInputSchema = baseRoleSchema.extend({
	_id: objectIdStringSchema.optional(),
});

export type UpsertRoleServiceInput = z.infer<
	typeof upsertRoleServiceInputSchema
>;

export type Role = z.infer<typeof roleSchema>;
