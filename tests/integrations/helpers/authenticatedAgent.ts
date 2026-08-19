import request from "supertest";
import app from "../../../index.ts";

export async function createAuthenticatedAgent() {
	const agent = request.agent(app);

	const response = await agent.post("/api/v1/auth/login").send({
		email: process.env.GUEST_LOGIN_EMAIL,
		password: process.env.GUEST_LOGIN_PASSWORD,
	});

	if (response.status !== 200) {
		throw new Error(
			`Test login failed: ${response.status} ${JSON.stringify(response.body)}`,
		);
	}

	return agent;
}
