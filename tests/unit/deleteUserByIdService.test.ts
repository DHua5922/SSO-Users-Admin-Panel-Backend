import type { Mock } from "vitest";
import { SYSTEM_MANAGED_USER_DELETE_ERROR_MESSAGE } from "../../constants.ts";
import { deleteUserByIdDal, getUserDal } from "../../dal/user.ts";
import { deleteUserByIdService } from "../../services/user.ts";

vi.mock("../../dal/user.ts", () => ({
	deleteUserByIdDal: vi.fn(),
	getUserDal: vi.fn(),
}));

test("should not delete a system-managed user", async () => {
	const exec = vi.fn().mockResolvedValue({ systemManaged: true });
	(getUserDal as Mock).mockReturnValue({ exec });

	await expect(
		deleteUserByIdService("507f1f77bcf86cd799439011"),
	).rejects.toThrow(SYSTEM_MANAGED_USER_DELETE_ERROR_MESSAGE);
	expect(deleteUserByIdDal).not.toHaveBeenCalled();
});
