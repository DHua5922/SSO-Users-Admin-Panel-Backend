import User from "../models/User.ts";

export function getUserDal(query: Record<string, unknown>) {
	return User.findOne(query).exec();
}
