import { Types } from "mongoose";
import {
	deleteRoleByIdDal,
	getRoleCountDal,
	getRolesDal,
	upsertRoleDal,
} from "../dal/role.ts";
import { totalRolesSchema } from "../schemas/dashboard.ts";
import { objectIdSchema } from "../schemas/mongodb.ts";
import {
	type Role,
	roleSchema,
	type UpsertRoleServiceInput,
	upsertRoleServiceInputSchema,
} from "../schemas/role.ts";

const roleResponseSchema = roleSchema.extend({
	_id: objectIdSchema,
});

export async function getTotalRoleCountService() {
	const result = await getRoleCountDal({});
	return totalRolesSchema.parse(result);
}

export async function getAllRolesService() {
	const list = await getRolesDal({}).lean().exec();
	return list.map((role: Role) => roleSchema.parse(role));
}

export async function upsertRoleService(
	roleToUpdateInput: UpsertRoleServiceInput,
) {
	const { _id: roleInputId, ...roleInput } =
		upsertRoleServiceInputSchema.parse(roleToUpdateInput);
	const roleId = roleInputId || new Types.ObjectId().toHexString();

	const updatedRole = await upsertRoleDal(roleId, roleInput).exec();

	return roleResponseSchema.parse(updatedRole);
}

export async function deleteRoleByIdService(_id: Role["_id"]) {
	const result = await deleteRoleByIdDal(_id).exec();
	return roleResponseSchema.parse(result);
}
