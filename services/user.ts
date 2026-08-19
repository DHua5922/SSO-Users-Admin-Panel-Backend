import { ApiError } from "js-ts-kit";
import { Types } from "mongoose";
import { z } from "zod";
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
import { totalUsersSchema } from "../schemas/dashboard.ts";
import {
	type InternalUser,
	internalUserSchema,
	type UpsertUserServiceInput,
	upsertUserServiceInputSchema,
	userResponseSchema,
} from "../schemas/user.ts";
import { bcrypt } from "../utilities/security.ts";

export async function getTotalUserCountService() {
	const result = await getUserCountDal({});
	return totalUsersSchema.parse(result);
}

export async function getUserByIdService(_id: InternalUser["_id"]) {
	const result = await getUserDal({ _id }).populate("role").exec();
	return internalUserSchema.nullable().parse(result);
}

export async function getUserByEmailService(email: string) {
	const result = await getUserDal({ email }).populate("role").exec();
	return internalUserSchema.nullable().parse(result);
}

export async function getAllUsersService() {
	const list = await getUsersDal({}).populate("role").exec();
	return z.array(userResponseSchema).parse(list);
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

	const userId = userInputId ?? new Types.ObjectId().toHexString();

	const updatedUser = await upsertUserDal(userId, {
		...userInput,
		password: password ? await bcrypt.hashPassword(password, 10) : undefined,
	})
		.populate("role")
		.exec();

	return userResponseSchema.parse(updatedUser);
}

export async function deleteUserByIdService(_id: InternalUser["_id"]) {
	const user = await getUserDal({ _id }).exec();
	if (user?.systemManaged) {
		throw new ApiError(
			SYSTEM_MANAGED_USER_DELETE_ERROR_MESSAGE,
			FORBIDDEN_STATUS_CODE,
		);
	}

	const result = await deleteUserByIdDal(_id).populate("role").exec();
	return userResponseSchema.parse(result);
}
