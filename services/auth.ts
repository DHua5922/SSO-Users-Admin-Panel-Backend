import { ApiError, cookieExpireTime } from "js-ts-kit";
import {
	BAD_REQUEST_STATUS_CODE,
	WRONG_PASSWORD_ERROR_MESSAGE,
} from "../constants.ts";
import { userResponseSchema } from "../schemas/user.ts";
import { bcrypt } from "../utilities/security.ts";
import { checkRefreshTokenType, jwtToken } from "../utilities/token.ts";
import { getUserByEmailService } from "./user.ts";

export async function loginService(email: string, passwordInput: string) {
	const user = await getUserByEmailService(email);
	if (!user) {
		throw new ApiError("Invalid email", BAD_REQUEST_STATUS_CODE);
	}

	const isMatchingPassword = await bcrypt.isMatchingPassword(
		user.password,
		passwordInput,
	);
	if (!isMatchingPassword) {
		throw new ApiError(WRONG_PASSWORD_ERROR_MESSAGE, BAD_REQUEST_STATUS_CODE);
	}

	return {
		user: userResponseSchema.parse(user),
		...createTokens(user._id),
	};
}

export async function refreshTokensService(refreshToken: string) {
	const tokenPayload = jwtToken.decode(refreshToken);

	checkRefreshTokenType(tokenPayload?.type);

	return createTokens(tokenPayload.userId);
}

function createTokens(userId: string) {
	const accessTokenExpireTime = process.env.ACCESS_TOKEN_EXPIRATION || "15m";
	const refreshTokenExpireTime = process.env.REFRESH_TOKEN_EXPIRATION || "7d";

	return {
		accessToken: jwtToken.create({
			userId,
			type: "access",
			expiresIn: accessTokenExpireTime,
		}),
		refreshToken: jwtToken.create({
			userId,
			type: "refresh",
			expiresIn: refreshTokenExpireTime,
		}),
		cookieAccessTokenExpireTime: cookieExpireTime(accessTokenExpireTime),
		cookieRefreshTokenExpireTime: cookieExpireTime(refreshTokenExpireTime),
	};
}
