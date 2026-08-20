import { ApiError } from "js-ts-kit";
import { Types } from "mongoose";
import {
	FORBIDDEN_STATUS_CODE,
	SYSTEM_MANAGED_ROLE_DELETE_ERROR_MESSAGE,
} from "../constants.ts";
import {
	deleteRoleByIdDal,
	getRoleCountDal,
	getRoleDal,
	getRolesDal,
	upsertRoleDal,
} from "../dal/role.ts";
import type { PersistedRole, UpsertRoleInput } from "../schemas/role.ts";

export function getTotalRoleCountService() {
	return getRoleCountDal({});
}

export function getAllRolesService() {
	return getRolesDal({}).lean().exec();
}

export async function upsertRoleService(roleToUpdateInput: UpsertRoleInput) {
	const { _id: roleInputId, ...roleInput } = roleToUpdateInput;
	const roleId = roleInputId ?? new Types.ObjectId().toHexString();
	const roleKey = roleInputId ? undefined : `custom:${roleId}`;

	const updatedRole = await upsertRoleDal(roleId, {
		...roleInput,
		key: roleKey,
	}).exec();

	return updatedRole;
}

export async function deleteRoleByIdService(_id: PersistedRole["_id"]) {
	const role = await getRoleDal({ _id }).exec();
	if (role?.systemManaged) {
		throw new ApiError(
			SYSTEM_MANAGED_ROLE_DELETE_ERROR_MESSAGE,
			FORBIDDEN_STATUS_CODE,
		);
	}

	const result = await deleteRoleByIdDal(_id).exec();
	return result;
}
