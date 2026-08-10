import { getUserDal } from "../dal/user.ts";

export function getUserByIdService(_id: string) {
	return getUserDal({ _id }).populate("role").exec();
}

export function getUserByEmailService(email: string) {
	return getUserDal({ email }).populate("role").exec();
}
