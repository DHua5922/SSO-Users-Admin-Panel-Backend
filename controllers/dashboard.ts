import type { Response } from "express";
import { getDashboardStatsCompositeService } from "../composite-services/dashboard.ts";
import { SUCCESS_STATUS_CODE } from "../constants.ts";
import type { RequestWithUser } from "../types/request.ts";

export async function getDashboardStatsController(
	_req: RequestWithUser,
	res: Response,
) {
	res
		.status(SUCCESS_STATUS_CODE)
		.json(await getDashboardStatsCompositeService());
}
