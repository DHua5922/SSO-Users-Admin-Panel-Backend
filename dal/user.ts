import User from "../models/User.ts";
import type { InternalUser, UpsertUserServiceInput } from "../schemas/user.ts";

export function getUserCountDal(query: Partial<InternalUser>) {
	return User.countDocuments(query);
}

export function getUserDal(query: Partial<InternalUser>) {
	return User.findOne(query);
}

export function getUsersDal(query: Partial<InternalUser>) {
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

export function deleteUserByIdDal(id: InternalUser["_id"]) {
	return User.findOneAndDelete({
		_id: id,
		systemManaged: { $ne: true },
	});
}
