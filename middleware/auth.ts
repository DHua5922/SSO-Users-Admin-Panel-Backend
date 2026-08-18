import type { NextFunction, Response } from "express";
import { getUserByIdService } from "../services/user.ts";
import type { RequestWithUser } from "../types/request.ts";
import {
	checkAccessTokenType,
	checkRole,
	checkToken,
	jwtToken,
} from "../utilities/token.ts";

export async function secureMiddleware(
	req: RequestWithUser,
	_res: Response,
	next: NextFunction,
) {
	const accessTokenName = process.env.ACCESS_TOKEN_NAME || "";
	const token = req.cookies[accessTokenName];

	checkToken(token);

	const tokenPayload = jwtToken.decode(token);
	checkAccessTokenType(tokenPayload?.type);

	const user = await getUserByIdService(tokenPayload?.userId);
	checkRole(user.role.key);
	req.user = user;

	next();
}
