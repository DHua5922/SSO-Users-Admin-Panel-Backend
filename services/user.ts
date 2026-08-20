import { ApiError } from "js-ts-kit";
import { Types } from "mongoose";
import {
	FORBIDDEN_STATUS_CODE,
	SYSTEM_MANAGED_USER_DELETE_ERROR_MESSAGE,
} from "../constants.ts";
import {
	deleteUserByIdDal,
	getUserCountDal,
	getUserDal,
	getUsersDal,
	upsertUserDal,
} from "../dal/user.ts";
import type { PersistedUser, UpsertUserInput } from "../schemas/user.ts";
import { bcrypt } from "../utilities/security.ts";

export function getTotalUserCountService() {
	return getUserCountDal({});
}

export function getUserByIdService(_id: PersistedUser["_id"]) {
	return getUserDal({ _id }).populate("role").exec();
}

export function getUserByEmailService(email: string) {
	return getUserDal({ email }).populate("role").exec();
}

export function getAllUsersService() {
	return getUsersDal({}).populate("role").exec();
}

export async function upsertUserService(userToUpdateInput: UpsertUserInput) {
	const {
		confirmPassword,
		password,
		_id: userInputId,
		...userInput
	} = userToUpdateInput;

	const userId = userInputId ?? new Types.ObjectId().toHexString();
	const hashedPassword = password
		? await bcrypt.hashPassword(password, 10)
		: undefined;

	const updatedUser = await upsertUserDal(userId, {
		...userInput,
		password: hashedPassword,
	})
		.populate("role")
		.exec();

	return updatedUser;
}

export async function deleteUserByIdService(_id: PersistedUser["_id"]) {
	const user = await getUserDal({ _id }).exec();
	if (user?.systemManaged) {
		throw new ApiError(
			SYSTEM_MANAGED_USER_DELETE_ERROR_MESSAGE,
			FORBIDDEN_STATUS_CODE,
		);
	}

	const deletedUser = await deleteUserByIdDal(_id).populate("role").exec();
	return deletedUser;
}
