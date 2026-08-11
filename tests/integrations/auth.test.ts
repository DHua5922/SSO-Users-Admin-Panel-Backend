import type TestAgent from "supertest/lib/agent.js";
import { SUCCESS_STATUS_CODE } from "../../constants.ts";
import { createAuthenticatedAgent } from "./helpers/authenticatedAgent.ts";

let agent: TestAgent;

beforeEach(async () => {
	agent = await createAuthenticatedAgent();
});

test("should give successful response", async () => {
	const response = await agent.post("/api/v1/auth/tokens/new");

	expect(response.status).toBe(SUCCESS_STATUS_CODE);
	expect(response.body).toEqual(true);
});
