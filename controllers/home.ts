import type { Request, Response } from "express";
import { HOME_RESPONSE_MESSAGE, SUCCESS_STATUS_CODE } from "../constants.ts";

export function homeController(_req: Request, res: Response) {
	res.status(SUCCESS_STATUS_CODE).send(HOME_RESPONSE_MESSAGE);
}
