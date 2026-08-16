import { z } from "zod";
import { getRolesController } from "../controllers/role.ts";
import {
	errorLoggingMiddleware,
	loggingMiddleware,
} from "../middleware/logging.ts";
import { roleSchema } from "../schemas/role.ts";
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
						schema: z.array(roleSchema),
					},
				},
			},
		},
	},
	loggingMiddleware,
	errorLoggingMiddleware(getRolesController),
);

export default router;
