import { Types } from "mongoose";
import { z } from "zod";
import {
	deleteRoleByIdDal,
	getRoleCountDal,
	getRolesDal,
	upsertRoleDal,
} from "../dal/role.ts";
import { totalRolesSchema } from "../schemas/dashboard.ts";
import {
	type Role,
	roleSchema,
	type UpsertRoleServiceInput,
	upsertRoleServiceInputSchema,
} from "../schemas/role.ts";

export async function getTotalRoleCountService() {
	const result = await getRoleCountDal({});
	return totalRolesSchema.parse(result);
}

export async function getAllRolesService() {
	const list = await getRolesDal({}).lean().exec();
	return z.array(roleSchema).parse(list);
}

export async function upsertRoleService(
	roleToUpdateInput: UpsertRoleServiceInput,
) {
	const { _id: roleInputId, ...roleInput } =
		upsertRoleServiceInputSchema.parse(roleToUpdateInput);
	const roleId = roleInputId || new Types.ObjectId().toHexString();
	const roleKey = roleInputId ? undefined : `custom:${roleId}`;

	const updatedRole = await upsertRoleDal(roleId, {
		...roleInput,
		key: roleKey,
	}).exec();

	return roleSchema.parse(updatedRole);
}

export async function deleteRoleByIdService(_id: Role["_id"]) {
	const result = await deleteRoleByIdDal(_id).exec();
	return roleSchema.parse(result);
}
