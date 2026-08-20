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
import {
	type PersistedUser,
	persistedUserSchema,
	type UpsertUserInput,
} from "../schemas/user.ts";
import { bcrypt } from "../utilities/security.ts";

export async function getTotalUserCountService() {
	const result = await getUserCountDal({});
	return result;
}

export async function getUserByIdService(_id: PersistedUser["_id"]) {
	const result = await getUserDal({ _id }).populate("role").exec();
	return persistedUserSchema.nullable().parse(result);
}

export async function getUserByEmailService(email: string) {
	const result = await getUserDal({ email }).populate("role").exec();
	return persistedUserSchema.nullable().parse(result);
}

export async function getAllUsersService() {
	const list = await getUsersDal({}).populate("role").exec();
	return list;
}

export async function upsertUserService(userToUpdateInput: UpsertUserInput) {
	const {
		confirmPassword,
		password,
		_id: userInputId,
		...userInput
	} = userToUpdateInput;

	const userId = userInputId ?? new Types.ObjectId().toHexString();

	const updatedUser = await upsertUserDal(userId, {
		...userInput,
		password: password ? await bcrypt.hashPassword(password, 10) : undefined,
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

	const result = await deleteUserByIdDal(_id).populate("role").exec();
	return result;
}
