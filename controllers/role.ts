import type { Request, Response } from "express";
import { SUCCESS_STATUS_CODE } from "../constants.ts";
import { getAllRolesService } from "../services/role.ts";

export async function getRolesController(_req: Request, res: Response) {
	res.status(SUCCESS_STATUS_CODE).json(await getAllRolesService());
}
