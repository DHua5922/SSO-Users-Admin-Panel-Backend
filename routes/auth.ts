import { z } from "zod";
import {
	guestLoginController,
	loginController,
	logoutController,
	refreshTokensController,
} from "../controllers/auth.ts";
import { secureMiddleware } from "../middleware/auth.ts";
import {
	errorLoggingMiddleware,
	loggingMiddleware,
} from "../middleware/logging.ts";
import { loginRequestBodySchema } from "../schemas/auth.ts";
import { userResponseSchema } from "../schemas/user.ts";
import { createDocumentedRoute } from "../utilities/docs.ts";

const { router, route } = createDocumentedRoute("/api/v1/auth");

const tags = ["Authentication"];
const userResponseConfig = {
	"200": {
		content: {
			"application/json": {
				schema: userResponseSchema,
			},
		},
	},
};
const booleanResponseConfig = {
	"200": {
		content: {
			"application/json": {
				schema: z.boolean(),
			},
		},
	},
};

route(
	{
		path: "/login",
		method: "post",
		tags,
		summary: "Log in",
		description:
			"Authenticate a user and returns user information. The password is not included in the response. Access token and refresh token are set as http-only cookies.",
		request: {
			body: {
				content: {
					"application/json": {
						schema: loginRequestBodySchema,
					},
				},
				required: true,
			},
		},
		responses: userResponseConfig,
	},
	loggingMiddleware,
	errorLoggingMiddleware(loginController),
);

route(
	{
		path: "/login/guest",
		method: "post",
		tags,
		summary: "Log in as guest",
		description:
			"Authenticate a user as guest admin and returns user information. The password is not included in the response. Access token and refresh token are set as http-only cookies.",
		responses: userResponseConfig,
	},
	loggingMiddleware,
	errorLoggingMiddleware(guestLoginController),
);

route(
	{
		path: "/logout",
		method: "post",
		tags,
		summary: "Log out",
		description:
			"Log out the user by clearing the access token and refresh token cookies.",
		responses: booleanResponseConfig,
	},
	loggingMiddleware,
	errorLoggingMiddleware(secureMiddleware),
	errorLoggingMiddleware(logoutController),
);

route(
	{
		path: "/tokens/new",
		method: "post",
		tags,
		summary: "Refresh tokens",
		description:
			"Refresh the access token and refresh token and set them in http-only cookies. This endpoint uses the refresh token from the http-only cookie to generate new access and refresh tokens.",
		responses: booleanResponseConfig,
	},
	loggingMiddleware,
	errorLoggingMiddleware(refreshTokensController),
);

export default router;
