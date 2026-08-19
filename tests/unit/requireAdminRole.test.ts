import {
	ADMIN_KEY,
	FORBIDDEN_STATUS_CODE,
	WRONG_ROLE_ERROR_MESSAGE,
} from "../../constants.ts";
import { requireAdminRole } from "../../utilities/token.ts";

test("should throw an error if the user is not an administrator", () => {
	try {
		requireAdminRole("user");
	} catch (error) {
		expect(error).toMatchObject({
			message: WRONG_ROLE_ERROR_MESSAGE,
			status: FORBIDDEN_STATUS_CODE,
		});
	}
});

test("should not throw an error if the user is an administrator", () => {
	expect(() => requireAdminRole(ADMIN_KEY)).not.toThrow();
});
