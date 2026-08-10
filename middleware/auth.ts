import type { NextFunction, Response } from "express";
import { ApiError } from "js-ts-kit";
import {
	FORBIDDEN_STATUS_CODE,
	UNAUTHORIZED_ERROR_MESSAGE,
	UNAUTHORIZED_STATUS_CODE,
	WRONG_ROLE_ERROR_MESSAGE,
} from "../constants.ts";
import { getUserByIdService } from "../services/user.ts";
import type { RequestWithUser } from "../types/request.ts";
import { jwtToken } from "../utilities/token.ts";

export async function secureMiddleware(
	req: RequestWithUser,
	_res: Response,
	next: NextFunction,
) {
	const accessTokenName = process.env.ACCESS_TOKEN_NAME || "";
	const token = req.cookies[accessTokenName];

	checkToken(token);

	const tokenPayload = jwtToken.decode(token);
	const user = await getUserByIdService(tokenPayload?.userId);

	checkRole(user.role.name);

	req.user = user;

	next();
}

export function checkToken(token: string) {
	if (!token) {
		throw new ApiError(UNAUTHORIZED_ERROR_MESSAGE, UNAUTHORIZED_STATUS_CODE);
	}
}

export function checkRole(userRole: string) {
	if (userRole !== "admin") {
		throw new ApiError(WRONG_ROLE_ERROR_MESSAGE, FORBIDDEN_STATUS_CODE);
	}
}
