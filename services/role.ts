import { getRoleCountDal, getRolesDal } from "../dal/role.ts";
import { totalRolesSchema } from "../schemas/dashboard.ts";
import { type Role, roleSchema } from "../schemas/role.ts";

export async function getTotalRoleCountService() {
	const result = await getRoleCountDal({});
	return totalRolesSchema.parse(result);
}

export async function getAllRolesService() {
	const list = await getRolesDal({}).lean().exec();
	return list.map((role: Role) => roleSchema.parse(role));
}
