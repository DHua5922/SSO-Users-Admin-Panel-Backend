import { Types } from "mongoose";
import { z } from "zod";

export const objectIdStringSchema = z
	.string()
	.regex(/^[a-f\d]{24}$/i, "Invalid MongoDB ObjectId")
	.meta({
		type: "string",
		example: "66b55fc95c67d15013a5f101",
	});

export const objectIdSchema = z.preprocess(
	(id) => (id instanceof Types.ObjectId ? id.toHexString() : id),
	objectIdStringSchema,
);
