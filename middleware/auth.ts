import type { NextFunction, Response } from "express";
import { ApiError } from "js-ts-kit";
import {
	UNAUTHORIZED_ERROR_MESSAGE,
	UNAUTHORIZED_STATUS_CODE,
} from "../constants.ts";
import { getUserByIdService } from "../services/user.ts";
import type { RequestWithUser } from "../types/request.ts";
import {
	jwtToken,
	requireAccessTokenType,
	requireAdminRole,
	requireToken,
} from "../utilities/token.ts";

export async function secureMiddleware(
	req: RequestWithUser,
	_res: Response,
	next: NextFunction,
) {
	const accessTokenName = process.env.ACCESS_TOKEN_NAME || "";
	const token = req.cookies[accessTokenName];

	requireToken(token);

	const tokenPayload = jwtToken.decode(token);
	requireAccessTokenType(tokenPayload?.type);

	const user = await getUserByIdService(tokenPayload?.userId);
	if (!user) {
		throw new ApiError(UNAUTHORIZED_ERROR_MESSAGE, UNAUTHORIZED_STATUS_CODE);
	}

	requireAdminRole(user.role.key);
	req.user = user;

	next();
}
