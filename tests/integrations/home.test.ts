import request from "supertest";
import { HOME_RESPONSE_MESSAGE } from "../../constants.ts";
import { app } from "../../index.ts";

test("should give successful response", async () => {
	const response = await request(app).get("/");

	expect(response.status).toBe(200);
	expect(response.text).toEqual(HOME_RESPONSE_MESSAGE);
});
