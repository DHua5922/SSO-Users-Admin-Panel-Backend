import {
	INVALID_ACCESS_TOKEN_ERROR_MESSAGE,
	UNAUTHORIZED_STATUS_CODE,
} from "../../constants.ts";
import { requireAccessTokenType } from "../../utilities/token.ts";

test("should throw an error if the token type is not access", () => {
	try {
		requireAccessTokenType("refresh");
	} catch (error) {
		expect(error).toMatchObject({
			message: INVALID_ACCESS_TOKEN_ERROR_MESSAGE,
			status: UNAUTHORIZED_STATUS_CODE,
		});
	}
});

test("should not throw an error if the token type is access", () => {
	expect(() => requireAccessTokenType("access")).not.toThrow();
});
