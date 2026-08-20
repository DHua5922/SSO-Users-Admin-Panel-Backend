import Role from "../models/Role.ts";
import type { PersistedRole, UpsertRoleInput } from "../schemas/role.ts";

export function getRoleCountDal(query: Partial<PersistedRole>) {
	return Role.countDocuments(query);
}

export function getRolesDal(query: Partial<PersistedRole>) {
	return Role.find(query);
}

export function getRoleDal(query: Partial<PersistedRole>) {
	return Role.findOne(query);
}

export function upsertRoleDal(
	id: UpsertRoleInput["_id"],
	update: Partial<UpsertRoleInput> & { key?: string },
) {
	return Role.findByIdAndUpdate(id, update, {
		upsert: true,
		new: true,
		setDefaultsOnInsert: true,
	});
}

export function deleteRoleByIdDal(id: PersistedRole["_id"]) {
	return Role.findOneAndDelete({
		_id: id,
		systemManaged: { $ne: true },
	});
}
