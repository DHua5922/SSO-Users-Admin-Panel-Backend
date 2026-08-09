import { ApiError, cookieExpireTime } from "js-ts-kit";
import { z } from "zod";
import { BAD_REQUEST_STATUS_CODE } from "../constants.ts";
import { objectIdSchema } from "../schemas/mongodb.ts";
import { bcrypt } from "../utilities/security.ts";
import { jwtToken } from "../utilities/token.ts";
import { getUserByEmailService } from "./user.ts";

export async function loginService(email: string, passwordInput: string) {
	const userSchema = z
		.object({
			_id: objectIdSchema,
			username: z.string().min(1),
			email: z.email(),
			role: objectIdSchema,
			password: z.string().min(1),
			dateCreated: z.date(),
		})
		.nullish();

	const user = userSchema.parse(await getUserByEmailService(email));
	if (!user) {
		throw new ApiError("Invalid email", BAD_REQUEST_STATUS_CODE);
	}

	const isMatchingPassword = await bcrypt.isMatchingPassword(
		user.password,
		passwordInput,
	);
	if (!isMatchingPassword) {
		throw new ApiError("Invalid password", BAD_REQUEST_STATUS_CODE);
	}

	const accessTokenExpireTime = process.env.ACCESS_TOKEN_EXPIRATION || "15m";
	const refreshTokenExpireTime = process.env.REFRESH_TOKEN_EXPIRATION || "7d";

	const { password, ...userWithoutPassword } = user;
	return {
		user: userWithoutPassword,
		accessToken: jwtToken.create({
			userId: user._id,
			type: "access",
			expiresIn: accessTokenExpireTime,
		}),
		refreshToken: jwtToken.create({
			userId: user._id,
			type: "refresh",
			expiresIn: refreshTokenExpireTime,
		}),
		cookieAccessTokenExpireTime: cookieExpireTime(accessTokenExpireTime),
		cookieRefreshTokenExpireTime: cookieExpireTime(refreshTokenExpireTime),
	};
}
