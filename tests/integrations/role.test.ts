import type TestAgent from "supertest/lib/agent.js";
import { SUCCESS_STATUS_CODE } from "../../constants.ts";
import { createAuthenticatedAgent } from "./helpers/authenticatedAgent.ts";

let agent: TestAgent;

const baseRoute = "/api/v1/roles";

beforeEach(async () => {
	agent = await createAuthenticatedAgent();
});

test("should get roles", async () => {
	const expectedSampleRole = {
		_id: expect.any(String),
		name: expect.any(String),
		description: expect.any(String),
	};
	const response = await agent.get(baseRoute);

	expect(response.status).toBe(SUCCESS_STATUS_CODE);
	expect(response.body.length).toBeGreaterThan(0);
	expect(response.body[0]).toEqual(expectedSampleRole);
});
