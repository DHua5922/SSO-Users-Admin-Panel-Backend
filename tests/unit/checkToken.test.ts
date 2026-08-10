import { UNAUTHORIZED_ERROR_MESSAGE } from "../../constants.ts";
import { checkToken } from "../../middleware/auth.ts";

test("should throw an error if the token is invalid", () => {
	expect(() => checkToken("")).toThrow(UNAUTHORIZED_ERROR_MESSAGE);
});

test("should not throw an error if the token is valid", () => {
	expect(() => checkToken("validToken")).not.toThrow();
});
