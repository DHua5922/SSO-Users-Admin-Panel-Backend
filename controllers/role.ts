import type { Request, Response } from "express";
import { z } from "zod";
import { SUCCESS_STATUS_CODE } from "../constants.ts";
import { roleSchema, upsertRoleServiceInputSchema } from "../schemas/role.ts";
import {
	deleteRoleByIdService,
	getAllRolesService,
	upsertRoleService,
} from "../services/role.ts";

export async function getRolesController(_req: Request, res: Response) {
	const roles = await getAllRolesService();
	res.status(SUCCESS_STATUS_CODE).json(z.array(roleSchema).parse(roles));
}

export async function upsertRoleController(req: Request, res: Response) {
	const input = upsertRoleServiceInputSchema.parse(req.body);
	const role = await upsertRoleService(input);
	res.status(SUCCESS_STATUS_CODE).json(roleSchema.parse(role));
}

export async function deleteRoleController(req: Request, res: Response) {
	const role = await deleteRoleByIdService(req.params.id as string);
	res.status(SUCCESS_STATUS_CODE).json(roleSchema.parse(role));
}
