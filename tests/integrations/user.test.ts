import type TestAgent from "supertest/lib/agent.js";
import { SUCCESS_STATUS_CODE } from "../../constants.ts";
import { createAuthenticatedAgent } from "./helpers/authenticatedAgent.ts";

let agent: TestAgent;

const baseRoute = "/api/v1/users";
const adminRoleId = "6a773d2ebbf0128a47f1a921";
const testPassword = "testpassword";

beforeEach(async () => {
	agent = await createAuthenticatedAgent();
});

test("should get users", async () => {
	const expectedSampleUser = {
		_id: expect.any(String),
		username: expect.any(String),
		email: expect.any(String),
		role: expect.any(String),
		dateCreated: expect.any(String),
	};
	const response = await agent.get(baseRoute);

	expect(response.status).toBe(SUCCESS_STATUS_CODE);
	expect(response.body.length).toBeGreaterThan(0);
	expect(response.body[0]).toEqual(expectedSampleUser);
});

test("should create user", async () => {
	const newUser = {
		username: "testuser1",
		email: "testuser1@email.com",
		password: testPassword,
		confirmPassword: testPassword,
		role: adminRoleId,
	};
	const expectedResponseBody = {
    _id: expect.any(String),
    username: newUser.username,
    email: newUser.email,
    role: adminRoleId,
    dateCreated: expect.any(String),
  };

	const response = await agent.put(baseRoute).send(newUser);
	expect(response.status).toBe(SUCCESS_STATUS_CODE);
	expect(response.body).toEqual(expectedResponseBody);

	await deleteTestUser(response.body._id);
});

test("should update user", async () => {
	const newUser = {
		username: "testuser2",
		email: "testuser2@email.com",
		password: testPassword,
		confirmPassword: testPassword,
		role: adminRoleId,
	};
	const createResponse = await agent.put(baseRoute).send(newUser);

	const updatedUser = {
		...newUser,
		_id: createResponse.body._id,
		username: "updateduser",
	};
	const expectedResponseBody = {
		_id: updatedUser._id,
		username: updatedUser.username,
		email: updatedUser.email,
		role: adminRoleId,
		dateCreated: createResponse.body.dateCreated,
	};

	const updateResponse = await agent.put(baseRoute).send(updatedUser);
	expect(updateResponse.status).toBe(SUCCESS_STATUS_CODE);
	expect(updateResponse.body).toEqual(expectedResponseBody);

	await deleteTestUser(updateResponse.body._id);
});

async function deleteTestUser(userId: string) {
	const expectedResponseBody = {
    _id: userId,
    username: expect.any(String),
    email: expect.any(String),
    role: adminRoleId,
    dateCreated: expect.any(String),
  };
	const deleteResponse = await agent.delete(`${baseRoute}/${userId}`);

	expect(deleteResponse.status).toBe(SUCCESS_STATUS_CODE);
	expect(deleteResponse.body).toEqual(expectedResponseBody);
}
