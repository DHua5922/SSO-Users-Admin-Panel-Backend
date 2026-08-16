import { z } from "zod";

export const totalUsersSchema = z.number().int().nonnegative();
export const totalRolesSchema = z.number().int().nonnegative();
export const dashboardStatsSchema = z.object({
	totalUsers: totalUsersSchema,
	totalRoles: totalRolesSchema,
});
