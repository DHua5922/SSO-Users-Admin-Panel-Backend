import { Types } from "mongoose";
import {
	deleteUserByIdDal,
	getUserDal,
	getUsersDal,
	upsertUserDal,
} from "../dal/user.ts";
import {
	type UpsertUserServiceInput,
	type User,
	upsertUserServiceInputSchema,
	userResponseSchema,
} from "../schemas/user.ts";
import { bcrypt } from "../utilities/security.ts";

export function getUserByIdService(_id: User["_id"]) {
	return getUserDal({ _id }).populate("role").exec();
}

export function getUserByEmailService(email: string) {
	return getUserDal({ email }).populate("role").exec();
}

export async function getAllUsersService() {
	const list = await getUsersDal({}).populate("role").exec();
	return list.map((user: User) => userResponseSchema.parse(user));
}

export async function upsertUserService(
	userToUpdateInput: UpsertUserServiceInput,
) {
	const {
		confirmPassword,
		password,
		_id: userInputId,
		...userInput
	} = upsertUserServiceInputSchema.parse(userToUpdateInput);

	const userId = userInputId || new Types.ObjectId().toHexString();

	const updatedUser = await upsertUserDal(userId, {
		...userInput,
		password: password ? await bcrypt.hashPassword(password, 10) : undefined,
	})
		.populate("role")
		.exec();

	return userResponseSchema.parse(updatedUser);
}

export async function deleteUserByIdService(_id: User["_id"]) {
	const result = await deleteUserByIdDal(_id).populate("role").exec();
	return userResponseSchema.parse(result);
}
