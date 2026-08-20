import type { Response } from "express";
import { SUCCESS_STATUS_CODE } from "../constants.ts";
import { userResponseSchema } from "../schemas/user.ts";
import type { RequestWithUser } from "../types/request.ts";

export function meController(req: RequestWithUser, res: Response) {
	const userResponse = userResponseSchema.parse(req.user);
	res.status(SUCCESS_STATUS_CODE).json(userResponse);
}
