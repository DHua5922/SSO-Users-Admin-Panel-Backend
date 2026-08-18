import { Types } from "mongoose";
import type { Mock } from "vitest";
import {
	EMPTY_EMAIL_ERROR_MESSAGE,
	EMPTY_PASSWORD_ERROR_MESSAGE,
	EMPTY_USERNAME_ERROR_MESSAGE,
	NO_MATCHING_PASSWORDS_ERROR_MESSAGE,
} from "../../constants.ts";
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
	_id: "",
	username: "testuser",
	email: "testUser@email.com",
	role: roleId.toHexString(),
	password: "password",
	confirmPassword: "password",
};

vi.mock("../../dal/user.ts", () => ({
	upsertUserDal: vi.fn(),
}));

test("should throw error if username is empty", async () => {
	await expect(
		upsertUserService({
			...createUserServiceInput,
			username: "",
		}),
	).rejects.toThrow(EMPTY_USERNAME_ERROR_MESSAGE);
});

test("should throw error if email is empty", async () => {
	await expect(
		upsertUserService({
			...createUserServiceInput,
			email: "",
		}),
	).rejects.toThrow(EMPTY_EMAIL_ERROR_MESSAGE);
});

test("should throw an error if password is empty for new user", async () => {
	await expect(
		upsertUserService({
			...createUserServiceInput,
			password: "",
		}),
	).rejects.toThrow(EMPTY_PASSWORD_ERROR_MESSAGE);
});

test("should throw an error if passwords do not match", async () => {
	await expect(
		upsertUserService({
			...createUserServiceInput,
			confirmPassword: `${createUserServiceInput.password}1`,
		}),
	).rejects.toThrow(NO_MATCHING_PASSWORDS_ERROR_MESSAGE);
});

test("should create a new user successfully", async () => {
	const createUserResult = {
		_id: userId,
		username: createUserServiceInput.username,
		email: createUserServiceInput.email,
		role: populatedRole,
		password: "hashedPassword",
		dateCreated,
	};
	const { password, ...expectedResult } = {
		...createUserResult,
		_id: userId.toHexString(),
		role: roleId.toHexString(),
	};

	mockUpsertUser(createUserResult);
	await expect(upsertUserService(createUserServiceInput)).resolves.toEqual(
		expectedResult,
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

	const expectedUpdateUserServiceResult = {
		...updateUserResult,
		_id: userId.toHexString(),
		role: roleId.toHexString(),
	};

	mockUpsertUser(updateUserResult);
	await expect(upsertUserService(updateUserServiceInput)).resolves.toEqual(
		expectedUpdateUserServiceResult,
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
