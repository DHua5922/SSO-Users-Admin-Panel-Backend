import { meController } from "../controllers/me.ts";
import { secureMiddleware } from "../middleware/auth.ts";
import {
	errorLoggingMiddleware,
	loggingMiddleware,
} from "../middleware/logging.ts";
import { userResponseSchema } from "../schemas/user.ts";
import { createDocumentedRoute } from "../utilities/docs.ts";

const { router, route } = createDocumentedRoute("/api/v1/me");

route(
	{
		path: "/",
		method: "get",
		tags: ["Me"],
		summary: "Get current user",
		description:
			"Retrieve the currently authenticated user's information. The password is not included in the response.",
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
	errorLoggingMiddleware(secureMiddleware),
	errorLoggingMiddleware(meController),
);

export default router;
