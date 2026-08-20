import type { Response } from "express";
import { getDashboardStatsCompositeService } from "../composite-services/dashboard.ts";
import { SUCCESS_STATUS_CODE } from "../constants.ts";
import { dashboardStatsSchema } from "../schemas/dashboard.ts";
import type { RequestWithUser } from "../types/request.ts";

export async function getDashboardStatsController(
	_req: RequestWithUser,
	res: Response,
) {
	const stats = await getDashboardStatsCompositeService();
	res.status(SUCCESS_STATUS_CODE).json(dashboardStatsSchema.parse(stats));
}
