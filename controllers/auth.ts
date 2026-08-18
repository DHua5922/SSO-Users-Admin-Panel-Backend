import type { Request, Response } from "express";
import { SUCCESS_STATUS_CODE } from "../constants.ts";
import { loginService, refreshTokensService } from "../services/auth.ts";

export async function loginController(req: Request, res: Response) {
	const {
		user,
		accessToken,
		refreshToken,
		cookieAccessTokenExpireTime,
		cookieRefreshTokenExpireTime,
	} = await loginService(req.body.email, req.body.password);

	setCookies(
		res,
		accessToken,
		refreshToken,
		cookieAccessTokenExpireTime,
		cookieRefreshTokenExpireTime,
	);

	res.status(SUCCESS_STATUS_CODE).json(user);
}

export async function guestLoginController(_req: Request, res: Response) {
	const {
		user,
		accessToken,
		refreshToken,
		cookieAccessTokenExpireTime,
		cookieRefreshTokenExpireTime,
	} = await loginService(
		process.env.GUEST_LOGIN_EMAIL || "",
		process.env.GUEST_LOGIN_PASSWORD || "",
	);

	setCookies(
		res,
		accessToken,
		refreshToken,
		cookieAccessTokenExpireTime,
		cookieRefreshTokenExpireTime,
	);

	res.status(SUCCESS_STATUS_CODE).json(user);
}

export async function logoutController(_req: Request, res: Response) {
	const expiredDate = new Date(0);
	setCookies(res, "", "", expiredDate, expiredDate);
	res.status(SUCCESS_STATUS_CODE).json(true);
}

export async function refreshTokensController(req: Request, res: Response) {
	const oldRefreshToken = req.cookies[process.env.REFRESH_TOKEN_NAME || ""];
	const {
		accessToken,
		refreshToken,
		cookieAccessTokenExpireTime,
		cookieRefreshTokenExpireTime,
	} = await refreshTokensService(oldRefreshToken);

	setCookies(
		res,
		accessToken,
		refreshToken,
		cookieAccessTokenExpireTime,
		cookieRefreshTokenExpireTime,
	);

	res.status(SUCCESS_STATUS_CODE).json(true);
}

function setCookies(
	res: Response,
	accessToken: string,
	refreshToken: string,
	cookieAccessTokenExpireTime: Date,
	cookieRefreshTokenExpireTime: Date,
) {
	const standardCookieOptions = {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
	};

	res
		.cookie(process.env.ACCESS_TOKEN_NAME || "", accessToken, {
			...standardCookieOptions,
			sameSite: "lax",
			expires: cookieAccessTokenExpireTime,
		})
		.cookie(process.env.REFRESH_TOKEN_NAME || "", refreshToken, {
			...standardCookieOptions,
			sameSite: "strict",
			expires: cookieRefreshTokenExpireTime,
		});
}
