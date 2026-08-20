import { getDashboardStatsController } from "../controllers/dashboard.ts";
import { secureMiddleware } from "../middleware/auth.ts";
import {
	errorLoggingMiddleware,
	loggingMiddleware,
} from "../middleware/logging.ts";
import { dashboardStatsSchema } from "../schemas/dashboard.ts";
import { createDocumentedRoute } from "../utilities/docs.ts";

const { router, route } = createDocumentedRoute("/api/v1/dashboard");

route(
	{
		path: "/stats",
		method: "get",
		tags: ["Dashboard"],
		summary: "Get dashboard stats",
		description:
			"Retrieve the current statistics for the dashboard, including total users and total roles.",
		responses: {
			"200": {
				content: {
					"application/json": {
						schema: dashboardStatsSchema,
					},
				},
			},
		},
	},
	loggingMiddleware,
	errorLoggingMiddleware(secureMiddleware),
	errorLoggingMiddleware(getDashboardStatsController),
);

export default router;
