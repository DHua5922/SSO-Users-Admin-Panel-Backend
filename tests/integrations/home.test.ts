import request from "supertest";
import { HOME_RESPONSE_MESSAGE, SUCCESS_STATUS_CODE } from "../../constants.ts";
import { app } from "../../index.ts";

test("should give message", async () => {
	const response = await request(app).get("/");

	expect(response.status).toBe(SUCCESS_STATUS_CODE);
	expect(response.text).toEqual(HOME_RESPONSE_MESSAGE);
});
