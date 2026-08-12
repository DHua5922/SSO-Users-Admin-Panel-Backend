import { INVALID_ACCESS_TOKEN_ERROR_MESSAGE } from "../../constants.ts";
import { checkAccessTokenType } from "../../utilities/token.ts";

test("should throw an error if the token type is not access", () => {
	expect(() => checkAccessTokenType("refresh")).toThrow(
		INVALID_ACCESS_TOKEN_ERROR_MESSAGE,
	);
});

test("should not throw an error if the token type is access", () => {
	expect(() => checkAccessTokenType("access")).not.toThrow();
});
