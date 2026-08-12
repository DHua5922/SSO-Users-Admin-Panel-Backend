import { INVALID_REFRESH_TOKEN_ERROR_MESSAGE } from "../../constants.ts";
import { checkRefreshTokenType } from "../../utilities/token.ts";

test("should throw an error if the token type is not refresh", () => {
	expect(() => checkRefreshTokenType("access")).toThrow(
		INVALID_REFRESH_TOKEN_ERROR_MESSAGE,
	);
});

test("should not throw an error if the token type is refresh", () => {
	expect(() => checkRefreshTokenType("refresh")).not.toThrow();
});
