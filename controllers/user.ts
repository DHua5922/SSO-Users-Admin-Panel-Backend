import type { Request, Response } from "express";
import { z } from "zod";
import { SUCCESS_STATUS_CODE } from "../constants.ts";
import {
	upsertUserServiceInputSchema,
	userResponseSchema,
} from "../schemas/user.ts";
import {
	deleteUserByIdService,
	getAllUsersService,
	upsertUserService,
} from "../services/user.ts";

export async function getUsersController(_req: Request, res: Response) {
	const users = await getAllUsersService();
	res
		.status(SUCCESS_STATUS_CODE)
		.json(z.array(userResponseSchema).parse(users));
}

export async function upsertUserController(req: Request, res: Response) {
	const input = upsertUserServiceInputSchema.parse(req.body);
	const user = await upsertUserService(input);
	res.status(SUCCESS_STATUS_CODE).json(userResponseSchema.parse(user));
}

export async function deleteUserController(req: Request, res: Response) {
	const user = await deleteUserByIdService(req.params.id as string);
	res.status(SUCCESS_STATUS_CODE).json(userResponseSchema.parse(user));
}
