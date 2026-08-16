import { dashboardStatsSchema } from "../schemas/dashboard.ts";
import { getTotalRoleCountService } from "../services/role.ts";
import { getTotalUserCountService } from "../services/user.ts";

export async function getDashboardStatsCompositeService() {
	return dashboardStatsSchema.parse({
		totalUsers: await getTotalUserCountService(),
		totalRoles: await getTotalRoleCountService(),
	});
}
