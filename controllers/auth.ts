import type { Request, Response } from "express";
import { SUCCESS_STATUS_CODE } from "../constants.ts";
import { loginService } from "../services/auth.ts";

const standardCookieOptions = {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
};

export async function loginController(req: Request, res: Response) {
	const {
		user,
		accessToken,
		cookieAccessTokenExpireTime,
		refreshToken,
		cookieRefreshTokenExpireTime,
	} = await loginService(req.body.email, req.body.password);

	res
		.status(SUCCESS_STATUS_CODE)
		.cookie(process.env.ACCESS_TOKEN_NAME || "", accessToken, {
			...standardCookieOptions,
			sameSite: "lax",
			expires: cookieAccessTokenExpireTime,
		})
		.cookie(process.env.REFRESH_TOKEN_NAME || "", refreshToken, {
			...standardCookieOptions,
			sameSite: "strict",
			expires: cookieRefreshTokenExpireTime,
		})
		.json(user);
}
