import { z } from "zod";
import { objectIdSchema } from "./mongodb.ts";

export const roleSchema = z.object({
	_id: objectIdSchema,
	name: z.string().min(1),
	description: z.string().optional(),
});

export type Role = z.infer<typeof roleSchema>;
