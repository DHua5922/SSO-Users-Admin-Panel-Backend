import { z } from "zod";
import { loginController } from "../controllers/auth.ts";
import {
	errorLoggingMiddleware,
	loggingMiddleware,
} from "../middleware/logging.ts";
import { userSchema } from "../schemas/user.ts";
import { createDocumentedRoute } from "../utilities/docs.ts";

const { router, route } = createDocumentedRoute("/api/v1/auth");

const loginRequestBodySchema = z.object({
	email: userSchema.shape.email,
	password: userSchema.shape.password,
});

route(
	{
		path: "/login",
		method: "post",
		tags: ["Authentication"],
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
						schema: userSchema.omit({ password: true }),
					},
				},
			},
		},
	},
	loggingMiddleware,
	errorLoggingMiddleware(loginController),
);

export default router;
