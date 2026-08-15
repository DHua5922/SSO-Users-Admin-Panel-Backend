import { getRolesDal } from "../dal/role.ts";
import { roleSchema, type Role } from "../schemas/role.ts";

export async function getAllRolesService() {
  const list = await getRolesDal({}).lean().exec();
  return list.map((role: Role) => roleSchema.parse(role));
}
