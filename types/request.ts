import type { Request } from "express";
import type { InternalUser } from "../schemas/user.ts";

export interface RequestWithUser extends Request {
	user?: InternalUser;
}
