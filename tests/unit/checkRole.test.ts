import { WRONG_ROLE_ERROR_MESSAGE } from "../../constants.ts";
import { checkRole } from "../../middleware/auth.ts";

test("checkRole should throw an error if the user does not have the required role", () => {
	expect(() => checkRole("user")).toThrow(WRONG_ROLE_ERROR_MESSAGE);
});

test("checkRole should not throw an error if the user has the required role", () => {
	expect(() => checkRole("admin")).not.toThrow();
});
