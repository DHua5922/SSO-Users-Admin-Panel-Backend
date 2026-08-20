import { z } from "zod";
import {
	deleteUserController,
	getUsersController,
	upsertUserController,
} from "../controllers/user.ts";
import { secureMiddleware } from "../middleware/auth.ts";
import {
	errorLoggingMiddleware,
	loggingMiddleware,
} from "../middleware/logging.ts";
import {
	upsertUserRequestSchema,
	userResponseSchema,
} from "../schemas/user.ts";
import { createDocumentedRoute } from "../utilities/docs.ts";

const { router, route } = createDocumentedRoute("/api/v1/users");

const tags = ["User"];
const userResponseConfig = {
	"200": {
		content: {
			"application/json": {
				schema: userResponseSchema,
			},
		},
	},
};

route(
	{
		path: "",
		method: "get",
		tags,
		summary: "Get all users",
		description: "Get all users. The password is not included in the response.",
		responses: {
			"200": {
				content: {
					"application/json": {
						schema: z.array(userResponseSchema),
					},
				},
			},
		},
	},
	loggingMiddleware,
	errorLoggingMiddleware(secureMiddleware),
	errorLoggingMiddleware(getUsersController),
);

route(
	{
		path: "",
		method: "put",
		tags,
		summary: "Upsert user",
		description:
			"Create or update a user. If you are updating a user, you must provide the user's ID in the request body; otherwise, a new user will be created. The password is not included in the response.",
		request: {
			body: {
				content: {
					"application/json": {
						schema: upsertUserRequestSchema,
					},
				},
				required: true,
			},
		},
		responses: userResponseConfig,
	},
	loggingMiddleware,
	errorLoggingMiddleware(secureMiddleware),
	errorLoggingMiddleware(upsertUserController),
);

route(
	{
		path: "/:id",
		method: "delete",
		tags,
		summary: "Delete user",
		description: "Delete a user by their ID.",
		responses: userResponseConfig,
	},
	loggingMiddleware,
	errorLoggingMiddleware(secureMiddleware),
	errorLoggingMiddleware(deleteUserController),
);

export default router;
