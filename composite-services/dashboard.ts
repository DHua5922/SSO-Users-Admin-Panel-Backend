import { getTotalRoleCountService } from "../services/role.ts";
import { getTotalUserCountService } from "../services/user.ts";

export async function getDashboardStatsCompositeService() {
	const [totalUsers, totalRoles] = await Promise.all([
		getTotalUserCountService(),
		getTotalRoleCountService(),
	]);

	return {
		totalUsers,
		totalRoles,
	};
}
