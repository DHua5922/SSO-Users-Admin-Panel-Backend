import type { Response } from "express";
import { SUCCESS_STATUS_CODE } from "../constants.ts";
import { userResponseSchema } from "../schemas/user.ts";
import type { RequestWithUser } from "../types/request.ts";

export async function meController(req: RequestWithUser, res: Response) {
	res.status(SUCCESS_STATUS_CODE).json(userResponseSchema.parse(req.user));
}
