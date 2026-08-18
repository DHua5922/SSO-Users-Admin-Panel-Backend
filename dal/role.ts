import Role from "../models/Role.ts";
import type {
	Role as RoleType,
	UpsertRoleServiceInput,
} from "../schemas/role.ts";

export function getRoleCountDal(query: Partial<RoleType>) {
	return Role.countDocuments(query);
}

export function getRolesDal(query: Partial<RoleType>) {
	return Role.find(query);
}

export function upsertRoleDal(
	id: UpsertRoleServiceInput["_id"],
	update: Partial<UpsertRoleServiceInput> & { key?: string },
) {
	return Role.findByIdAndUpdate(id, update, {
		upsert: true,
		new: true,
		setDefaultsOnInsert: true,
	});
}

export function deleteRoleByIdDal(id: RoleType["_id"]) {
	return Role.findByIdAndDelete(id);
}
