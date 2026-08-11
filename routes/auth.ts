import { z } from "zod";
import {
	loginController,
	refreshTokensController,
} from "../controllers/auth.ts";
import {
	errorLoggingMiddleware,
	loggingMiddleware,
} from "../middleware/logging.ts";
import { userResponseSchema, userSchema } from "../schemas/user.ts";
import { createDocumentedRoute } from "../utilities/docs.ts";

const { router, route } = createDocumentedRoute("/api/v1/auth");

const tags = ["Authentication"];

const loginRequestBodySchema = z.object({
	email: userSchema.shape.email,
	password: userSchema.shape.password,
});

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
		responses: {
			"200": {
				content: {
					"application/json": {
						schema: userResponseSchema,
					},
				},
			},
		},
	},
	loggingMiddleware,
	errorLoggingMiddleware(loginController),
);

route(
	{
		path: "/tokens/new",
		method: "post",
		tags,
		summary: "Refresh tokens",
		description:
			"Refresh the access token and refresh token and set them in http-only cookies. This endpoint uses the refresh token from the http-only cookie to generate new access and refresh tokens.",
		responses: {
			"200": {
				content: {
					"application/json": {
						schema: z.boolean(),
					},
				},
			},
		},
	},
	loggingMiddleware,
	errorLoggingMiddleware(refreshTokensController),
);

export default router;
