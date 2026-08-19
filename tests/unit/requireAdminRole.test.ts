import { ADMIN_KEY, WRONG_ROLE_ERROR_MESSAGE } from "../../constants.ts";
import { requireAdminRole } from "../../utilities/token.ts";

test("should throw an error if the user is not an administrator", () => {
	expect(() => requireAdminRole("user")).toThrow(WRONG_ROLE_ERROR_MESSAGE);
});

test("should not throw an error if the user is an administrator", () => {
	expect(() => requireAdminRole(ADMIN_KEY)).not.toThrow();
});
