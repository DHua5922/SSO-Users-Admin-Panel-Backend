import request from "supertest";
import { SUCCESS_STATUS_CODE } from "../../constants.ts";
import app from "../../index.ts";

test("should give OpenAPI document", async () => {
	const response = await request(app).get("/openapi.json");

	expect(response.status).toBe(SUCCESS_STATUS_CODE);
	expect(response.type).toBe("application/json");
	expect(response.body.openapi).toBe("3.0.0");
});

test("should give API documentation", async () => {
	const response = await request(app).get("/docs");

	expect(response.status).toBe(SUCCESS_STATUS_CODE);
	expect(response.type).toBe("text/html");
	expect(response.text).toContain('url: "/openapi.json"');
	expect(response.text).toContain("swagger-ui-bundle.js");
});
