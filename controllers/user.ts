import type { Request, Response } from "express";
import { z } from "zod";
import { SUCCESS_STATUS_CODE } from "../constants.ts";
import {
	upsertUserRequestSchema,
	userResponseSchema,
} from "../schemas/user.ts";
import {
	deleteUserByIdService,
	getAllUsersService,
	upsertUserService,
} from "../services/user.ts";

export async function getUsersController(_req: Request, res: Response) {
	const users = await getAllUsersService();
	const usersResponse = z.array(userResponseSchema).parse(users);
	res.status(SUCCESS_STATUS_CODE).json(usersResponse);
}

export async function upsertUserController(req: Request, res: Response) {
	const input = upsertUserRequestSchema.parse(req.body);
	const user = await upsertUserService(input);
	const userResponse = userResponseSchema.parse(user);
	res.status(SUCCESS_STATUS_CODE).json(userResponse);
}

export async function deleteUserController(req: Request, res: Response) {
	const user = await deleteUserByIdService(req.params.id as string);
	const userResponse = userResponseSchema.parse(user);
	res.status(SUCCESS_STATUS_CODE).json(userResponse);
}
