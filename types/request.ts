import type { Request } from "express";

interface User {
	_id: string;
	username: string;
	email: string;
	role: string;
	password: string;
	dateCreated: Date;
}

export interface RequestWithUser extends Request {
	user?: User;
}
