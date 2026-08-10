import { cookieExpireTime } from "js-ts-kit";
import { Types } from "mongoose";
import type { Mock } from "vitest";
import { loginService } from "../../services/auth.ts";
import { getUserByEmailService } from "../../services/user.ts";
import { bcrypt } from "../../utilities/security.ts";
import { jwtToken } from "../../utilities/token.ts";

vi.mock("../../services/user.ts", () => ({
	getUserByEmailService: vi.fn(),
}));

vi.mock("../../utilities/security.ts", () => ({
	bcrypt: {
		isMatchingPassword: vi.fn(),
	},
}));

vi.mock("../../utilities/token.ts", () => ({
	jwtToken: {
		create: vi.fn(),
	},
}));

const testUser = {
	_id: new Types.ObjectId("507f1f77bcf86cd799439011"),
	username: "testuser",
	email: "testUser@example.com",
	role: {
		_id: new Types.ObjectId("507f1f77bcf86cd799439012"),
		name: "admin",
		description: "Administrator role",
	},
	password: "$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQ8Z/5a6m0j0Z5F5F5F5G",
	dateCreated: new Date(),
};

test("should throw invalid email error message when email is not registered", async () => {
	const getUserByEmailServiceMock = getUserByEmailService as Mock;

	getUserByEmailServiceMock.mockResolvedValueOnce(null);

	const value = loginService("nonexistent@example.com", "anyPassword");
	await expect(value).rejects.toThrow("Invalid email");
});

test("should throw invalid password error message when password is incorrect", async () => {
	const getUserByEmailServiceMock = getUserByEmailService as Mock;
	const bcryptMock = bcrypt.isMatchingPassword as Mock;

	getUserByEmailServiceMock.mockResolvedValueOnce(testUser);
	bcryptMock.mockResolvedValueOnce(false);

	const value = loginService(testUser.email, "wrongPassword");
	await expect(value).rejects.toThrow("Invalid password");
});

test("should return user and token information when login is successful", async () => {
	const getUserByEmailServiceMock = getUserByEmailService as Mock;
	const isMatchingPasswordMock = bcrypt.isMatchingPassword as Mock;
	const createJwtTokenMock = jwtToken.create as Mock;

	getUserByEmailServiceMock.mockResolvedValueOnce(testUser);
	isMatchingPasswordMock.mockResolvedValueOnce(true);
	createJwtTokenMock
		.mockReturnValueOnce("accessToken")
		.mockReturnValueOnce("refreshToken");

	const { password, ...userWithoutPassword } = testUser;
	const value = await loginService(
		userWithoutPassword.email,
		"correctPassword",
	);
	const expectedResult = {
		user: {
			...userWithoutPassword,
			_id: userWithoutPassword._id.toHexString(),
			role: userWithoutPassword.role.name,
		},
		accessToken: "accessToken",
		refreshToken: "refreshToken",
		cookieAccessTokenExpireTime: cookieExpireTime(
			process.env.ACCESS_TOKEN_EXPIRATION || "15m",
		),
		cookieRefreshTokenExpireTime: cookieExpireTime(
			process.env.REFRESH_TOKEN_EXPIRATION || "7d",
		),
	};

	expect(value).toEqual(expectedResult);
});
