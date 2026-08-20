import { z } from "zod";

const statSchema = z.number().int().nonnegative();
export const dashboardStatsSchema = z.object({
	totalUsers: statSchema,
	totalRoles: statSchema,
});
