import { getTotalRoleCountService } from "../services/role.ts";
import { getTotalUserCountService } from "../services/user.ts";

export async function getDashboardStatsCompositeService() {
	return {
		totalUsers: await getTotalUserCountService(),
		totalRoles: await getTotalRoleCountService(),
	};
}
