import type TestAgent from "supertest/lib/agent.js";
import { SUCCESS_STATUS_CODE } from "../../constants.ts";
import { createAuthenticatedAgent } from "./helpers/authenticatedAgent.ts";

let agent: TestAgent;

beforeEach(async () => {
	agent = await createAuthenticatedAgent();
});

test("should give dashboard stats", async () => {
	const response = await agent.get("/api/v1/dashboard/stats");

	expect(response.status).toBe(SUCCESS_STATUS_CODE);
	expect(response.body).toEqual({
		totalUsers: expect.any(Number),
		totalRoles: expect.any(Number),
	});
});
