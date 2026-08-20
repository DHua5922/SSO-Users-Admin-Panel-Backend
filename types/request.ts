import type { Request } from "express";
import type { PersistedUser } from "../schemas/user.ts";

export interface RequestWithUser extends Request {
	user?: PersistedUser;
}

export interface RequestWithRequestId extends Request {
	requestId: string;
}
