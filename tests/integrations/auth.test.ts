import request from "supertest";
import type TestAgent from "supertest/lib/agent.js";
import { SUCCESS_STATUS_CODE } from "../../constants.ts";
import app from "../../index.ts";
import { createAuthenticatedAgent } from "./helpers/authenticatedAgent.ts";

let agent: TestAgent;

beforeEach(async () => {
	agent = await createAuthenticatedAgent();
});

test("should log in as guest admin", async () => {
	const response = await request(app).post("/api/v1/auth/login/guest").send({
		email: process.env.GUEST_LOGIN_EMAIL,
		password: process.env.GUEST_LOGIN_PASSWORD,
	});

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

test("should refresh tokens", async () => {
	const response = await agent.post("/api/v1/auth/tokens/new");

	expect(response.status).toBe(SUCCESS_STATUS_CODE);
	expect(response.body).toEqual(true);
});

test("should log out successfully", async () => {
	const response = await agent.post("/api/v1/auth/logout");

	expect(response.status).toBe(SUCCESS_STATUS_CODE);
	expect(response.body).toEqual(true);
});
