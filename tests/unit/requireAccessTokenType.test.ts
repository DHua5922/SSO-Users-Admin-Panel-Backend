import { INVALID_ACCESS_TOKEN_ERROR_MESSAGE } from "../../constants.ts";
import { requireAccessTokenType } from "../../utilities/token.ts";

test("should throw an error if the token type is not access", () => {
	expect(() => requireAccessTokenType("refresh")).toThrow(
		INVALID_ACCESS_TOKEN_ERROR_MESSAGE,
	);
});

test("should not throw an error if the token type is access", () => {
	expect(() => requireAccessTokenType("access")).not.toThrow();
});
