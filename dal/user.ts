import User from "../models/User.ts";
import type {
	UpsertUserServiceInput,
	User as UserType,
} from "../schemas/user.ts";

export function getUserCountDal(query: Partial<UserType>) {
	return User.countDocuments(query);
}

export function getUserDal(query: Partial<UserType>) {
	return User.findOne(query);
}

export function getUsersDal(query: Partial<UserType>) {
	return User.find(query);
}

export function upsertUserDal(
	id: UpsertUserServiceInput["_id"],
	update: Partial<UpsertUserServiceInput>,
) {
	return User.findByIdAndUpdate(id, update, {
		upsert: true,
		new: true,
		setDefaultsOnInsert: true,
	});
}

export function deleteUserByIdDal(id: UserType["_id"]) {
	return User.findByIdAndDelete(id);
}
