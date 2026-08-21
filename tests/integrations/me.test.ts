import type TestAgent from "supertest/lib/agent.js";
import { SUCCESS_STATUS_CODE } from "../../constants.ts";
import { createAuthenticatedAgent } from "./helpers/authenticatedAgent.ts";

let agent: TestAgent;

beforeEach(async () => {
	agent = await createAuthenticatedAgent();
});

test("should give authenticated user", async () => {
	const response = await agent.get("/api/v1/me");

	expect(response.status).toBe(SUCCESS_STATUS_CODE);
	expect(response.body).toEqual({
		_id: expect.any(String),
		username: expect.any(String),
		email: process.env.GUEST_LOGIN_EMAIL,
		role: {
			_id: expect.any(String),
			name: expect.any(String),
		},
		dateCreated: expect.any(String),
		systemManaged: true,
	});
});
