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

test("should create role", async () => {
	const newRole = {
		name: "test role",
		description: "test role description",
	};
	const expectedResponseBody = {
		_id: expect.any(String),
		name: newRole.name,
		description: newRole.description,
	};

	const response = await agent.put(baseRoute).send(newRole);
	expect(response.status).toBe(SUCCESS_STATUS_CODE);
	expect(response.body).toEqual(expectedResponseBody);
	await deleteTestRole(response.body._id);
});

test("should update role", async () => {
	const newRole = {
		name: "test role 2",
		description: "test role 2 description",
	};
	const createResponse = await agent.put(baseRoute).send(newRole);

	const updatedRole = {
		_id: createResponse.body._id,
		name: "updated role",
		description: "updated role description",
	};
	const expectedResponseBody = {
		_id: createResponse.body._id,
		name: updatedRole.name,
		description: updatedRole.description,
	};

	const updateResponse = await agent.put(baseRoute).send(updatedRole);
	expect(updateResponse.status).toBe(SUCCESS_STATUS_CODE);
	expect(updateResponse.body).toEqual(expectedResponseBody);

	await deleteTestRole(updateResponse.body._id);
});

async function deleteTestRole(roleId: string) {
	const expectedResponseBody = {
		_id: roleId,
		name: expect.any(String),
		description: expect.any(String),
	};
	const deleteResponse = await agent.delete(`${baseRoute}/${roleId}`);

	expect(deleteResponse.status).toBe(SUCCESS_STATUS_CODE);
	expect(deleteResponse.body).toEqual(expectedResponseBody);
}
