import { INVALID_REFRESH_TOKEN_ERROR_MESSAGE } from "../../constants.ts";
import { requireRefreshTokenType } from "../../utilities/token.ts";

test("should throw an error if the token type is not refresh", () => {
	expect(() => requireRefreshTokenType("access")).toThrow(
		INVALID_REFRESH_TOKEN_ERROR_MESSAGE,
	);
});

test("should not throw an error if the token type is refresh", () => {
	expect(() => requireRefreshTokenType("refresh")).not.toThrow();
});
