import { ApiError, JwtToken } from "js-ts-kit";
import jsonwebtoken from "jsonwebtoken";
import {
	ADMIN_KEY,
	FORBIDDEN_STATUS_CODE,
	INVALID_ACCESS_TOKEN_ERROR_MESSAGE,
	INVALID_REFRESH_TOKEN_ERROR_MESSAGE,
	UNAUTHORIZED_ERROR_MESSAGE,
	UNAUTHORIZED_STATUS_CODE,
	WRONG_ROLE_ERROR_MESSAGE,
} from "../constants.ts";

export const jwtToken = new JwtToken(
	jsonwebtoken,
	process.env.JWT_SECRET || "",
);

export function checkToken(token: string) {
	if (!token) {
		throw new ApiError(UNAUTHORIZED_ERROR_MESSAGE, UNAUTHORIZED_STATUS_CODE);
	}
}

export function checkAccessTokenType(type: string) {
	if (type !== "access") {
		throw new ApiError(
			INVALID_ACCESS_TOKEN_ERROR_MESSAGE,
			UNAUTHORIZED_STATUS_CODE,
		);
	}
}

export function checkRefreshTokenType(type: string) {
	if (type !== "refresh") {
		throw new ApiError(
			INVALID_REFRESH_TOKEN_ERROR_MESSAGE,
			UNAUTHORIZED_STATUS_CODE,
		);
	}
}

export function checkRole(
	roleKey: string,
	errorMessage = WRONG_ROLE_ERROR_MESSAGE,
) {
	if (roleKey !== ADMIN_KEY) {
		throw new ApiError(errorMessage, FORBIDDEN_STATUS_CODE);
	}
}
