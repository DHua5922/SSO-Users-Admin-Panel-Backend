import type { Request } from "express";
import type { User } from "../schemas/user.ts";

export interface RequestWithUser extends Request {
	user?: User;
}
