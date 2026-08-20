import User from "../models/User.ts";
import type { PersistedUser, UpsertUserInput } from "../schemas/user.ts";

export function getUserCountDal(query: Partial<PersistedUser>) {
	return User.countDocuments(query);
}

export function getUserDal(query: Partial<PersistedUser>) {
	return User.findOne(query);
}

export function getUsersDal(query: Partial<PersistedUser>) {
	return User.find(query);
}

export function upsertUserDal(
	id: UpsertUserInput["_id"],
	update: Partial<UpsertUserInput>,
) {
	return User.findByIdAndUpdate(id, update, {
		upsert: true,
		new: true,
		setDefaultsOnInsert: true,
	});
}

export function deleteUserByIdDal(id: PersistedUser["_id"]) {
	return User.findOneAndDelete({
		_id: id,
		systemManaged: { $ne: true },
	});
}
