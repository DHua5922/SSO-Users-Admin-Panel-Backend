import type { Request, Response } from "express";
import { SUCCESS_STATUS_CODE } from "../constants.ts";
import {
	deleteUserByIdService,
	getAllUsersService,
	upsertUserService,
} from "../services/user.ts";

export async function getUsersController(_req: Request, res: Response) {
	res.status(SUCCESS_STATUS_CODE).json(await getAllUsersService());
}

export async function upsertUserController(req: Request, res: Response) {
	res.status(SUCCESS_STATUS_CODE).json(await upsertUserService(req.body));
}

export async function deleteUserController(req: Request, res: Response) {
	res
		.status(SUCCESS_STATUS_CODE)
		.json(await deleteUserByIdService(req.params.id as string));
}
