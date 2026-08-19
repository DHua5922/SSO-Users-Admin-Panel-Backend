import type { Mock } from "vitest";
import {
	FORBIDDEN_STATUS_CODE,
	SYSTEM_MANAGED_USER_DELETE_ERROR_MESSAGE,
} from "../../constants.ts";
import { deleteUserByIdDal, getUserDal } from "../../dal/user.ts";
import { deleteUserByIdService } from "../../services/user.ts";

vi.mock("../../dal/user.ts", () => ({
	deleteUserByIdDal: vi.fn(),
	getUserDal: vi.fn(),
}));

test("should not delete a system-managed user", async () => {
	const exec = vi.fn().mockResolvedValue({ systemManaged: true });
	(getUserDal as Mock).mockReturnValue({ exec });

	const value = deleteUserByIdService("507f1f77bcf86cd799439011");
	await expect(value).rejects.toMatchObject({
		message: SYSTEM_MANAGED_USER_DELETE_ERROR_MESSAGE,
		status: FORBIDDEN_STATUS_CODE,
	});
	expect(deleteUserByIdDal).not.toHaveBeenCalled();
});
