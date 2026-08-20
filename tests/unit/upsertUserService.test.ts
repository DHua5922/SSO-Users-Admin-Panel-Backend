import { Types } from "mongoose";
import type { Mock } from "vitest";
import { upsertUserDal } from "../../dal/user.ts";
import { upsertUserService } from "../../services/user.ts";

const userId = new Types.ObjectId();
const roleId = new Types.ObjectId();
const populatedRole = {
	_id: roleId,
	name: "roleName",
	description: "roleDescription",
};
const dateCreated = new Date();

const createUserServiceInput = {
	_id: undefined,
	username: "testuser",
	email: "testUser@email.com",
	role: roleId.toHexString(),
	password: "password",
	confirmPassword: "password",
};

vi.mock("../../dal/user.ts", () => ({
	upsertUserDal: vi.fn(),
}));

test("should create a new user successfully", async () => {
	const createUserResult = {
		_id: userId,
		username: createUserServiceInput.username,
		email: createUserServiceInput.email,
		role: populatedRole,
		password: "hashedPassword",
		dateCreated,
	};
	mockUpsertUser(createUserResult);
	await expect(upsertUserService(createUserServiceInput)).resolves.toEqual(
		createUserResult,
	);
});

test("should update an existing user successfully", async () => {
	const updateUserServiceInput = {
		_id: userId.toHexString(),
		username: "updatedUser",
		email: "updatedUser@email.com",
		role: roleId.toHexString(),
	};

	const updateUserResult = {
		_id: userId,
		username: updateUserServiceInput.username,
		email: updateUserServiceInput.email,
		role: populatedRole,
		dateCreated,
	};

	mockUpsertUser(updateUserResult);
	await expect(upsertUserService(updateUserServiceInput)).resolves.toEqual(
		updateUserResult,
	);
});

interface UpsertResult {
	_id: Types.ObjectId;
	username: string;
	email: string;
	role: {
		_id: Types.ObjectId;
		name: string;
		description: string;
	};
	dateCreated: Date;
}
function mockUpsertUser(returnValue: UpsertResult) {
	const exec = vi.fn().mockResolvedValue(returnValue);
	const populate = vi.fn().mockReturnValue({ exec });
	const upsertUserDalMock = upsertUserDal as Mock;

	upsertUserDalMock.mockReturnValue({ populate });
}
