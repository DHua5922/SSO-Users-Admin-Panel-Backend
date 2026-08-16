import Role from "../models/Role.ts";
import type { Role as RoleType } from "../schemas/role.ts";

export function getRoleCountDal(query: Partial<RoleType>) {
	return Role.countDocuments(query);
}

export function getRolesDal(query: Partial<RoleType>) {
	return Role.find(query);
}
