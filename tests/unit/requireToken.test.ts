import { UNAUTHORIZED_ERROR_MESSAGE } from "../../constants.ts";
import { requireToken } from "../../utilities/token.ts";

test("should throw an error if the token is missing", () => {
	expect(() => requireToken("")).toThrow(UNAUTHORIZED_ERROR_MESSAGE);
});

test("should not throw an error if the token exists", () => {
	expect(() => requireToken("validToken")).not.toThrow();
});
