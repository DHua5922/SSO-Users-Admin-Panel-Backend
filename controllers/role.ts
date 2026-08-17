import type { Request, Response } from "express";
import { SUCCESS_STATUS_CODE } from "../constants.ts";
import {
	deleteRoleByIdService,
	getAllRolesService,
	upsertRoleService,
} from "../services/role.ts";

export async function getRolesController(_req: Request, res: Response) {
	res.status(SUCCESS_STATUS_CODE).json(await getAllRolesService());
}

export async function upsertRoleController(req: Request, res: Response) {
	res.status(SUCCESS_STATUS_CODE).json(await upsertRoleService(req.body));
}

export async function deleteRoleController(req: Request, res: Response) {
	res
		.status(SUCCESS_STATUS_CODE)
		.json(await deleteRoleByIdService(req.params.id as string));
}
