import { z } from "zod";
import {
	deleteRoleController,
	getRolesController,
	upsertRoleController,
} from "../controllers/role.ts";
import { secureMiddleware } from "../middleware/auth.ts";
import {
	errorLoggingMiddleware,
	loggingMiddleware,
} from "../middleware/logging.ts";
import {
	roleResponseSchema,
	upsertRoleRequestSchema,
} from "../schemas/role.ts";
import { createDocumentedRoute } from "../utilities/docs.ts";

const { router, route } = createDocumentedRoute("/api/v1/roles");

const tags = ["Role"];

route(
	{
		path: "",
		method: "get",
		tags,
		summary: "Get all roles",
		description: "Get all roles.",
		responses: {
			"200": {
				content: {
					"application/json": {
						schema: z.array(roleResponseSchema),
					},
				},
			},
		},
	},
	loggingMiddleware,
	errorLoggingMiddleware(secureMiddleware),
	errorLoggingMiddleware(getRolesController),
);

route(
	{
		path: "",
		method: "put",
		tags,
		summary: "Upsert role",
		description:
			"Create or update a role. If you are updating a role, you must provide the role's ID in the request body; otherwise, a new role will be created.",
		request: {
			body: {
				content: {
					"application/json": {
						schema: upsertRoleRequestSchema,
					},
				},
				required: true,
			},
		},
		responses: {
			"200": {
				content: {
					"application/json": {
						schema: roleResponseSchema,
					},
				},
			},
		},
	},
	loggingMiddleware,
	errorLoggingMiddleware(secureMiddleware),
	errorLoggingMiddleware(upsertRoleController),
);

route(
	{
		path: "/:id",
		method: "delete",
		tags,
		summary: "Delete role",
		description: "Delete a role by its ID.",
		responses: {
			"200": {
				content: {
					"application/json": {
						schema: roleResponseSchema,
					},
				},
			},
		},
	},
	loggingMiddleware,
	errorLoggingMiddleware(secureMiddleware),
	errorLoggingMiddleware(deleteRoleController),
);

export default router;
