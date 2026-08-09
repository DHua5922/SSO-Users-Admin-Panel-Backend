import { Types } from "mongoose";
import { z } from "zod";

export const objectIdSchema = z
	.instanceof(Types.ObjectId)
	.transform((id) => id.toHexString());
