import { Types } from "mongoose";
import { z } from "zod";

export const objectIdSchema = z
	.instanceof(Types.ObjectId)
	.transform((id) => id.toHexString())
	.meta({
		type: "string",
		example: "66b55fc95c67d15013a5f101",
	});

export const objectIdStringSchema = z.string().meta({
	type: "string",
	example: "66b55fc95c67d15013a5f101",
});
