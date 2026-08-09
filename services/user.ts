import { getUserDal } from "../dal/user.ts";

export function getUserByEmailService(email: string) {
	return getUserDal({ email });
}
