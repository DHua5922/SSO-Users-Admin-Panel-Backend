import type { Request, Response } from "express";
import { z } from "zod";
import { SUCCESS_STATUS_CODE } from "../constants.ts";
import {
	roleResponseSchema,
	upsertRoleRequestSchema,
} from "../schemas/role.ts";
import {
	deleteRoleByIdService,
	getAllRolesService,
	upsertRoleService,
} from "../services/role.ts";

export async function getRolesController(_req: Request, res: Response) {
	const roles = await getAllRolesService();
	const rolesResponse = z.array(roleResponseSchema).parse(roles);
	res.status(SUCCESS_STATUS_CODE).json(rolesResponse);
}

export async function upsertRoleController(req: Request, res: Response) {
	const input = upsertRoleRequestSchema.parse(req.body);
	const role = await upsertRoleService(input);
	const roleResponse = roleResponseSchema.parse(role);
	res.status(SUCCESS_STATUS_CODE).json(roleResponse);
}

export async function deleteRoleController(req: Request, res: Response) {
	const role = await deleteRoleByIdService(req.params.id as string);
	const roleResponse = roleResponseSchema.parse(role);
	res.status(SUCCESS_STATUS_CODE).json(roleResponse);
}
