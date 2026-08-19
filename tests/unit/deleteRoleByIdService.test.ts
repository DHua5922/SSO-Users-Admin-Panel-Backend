import type { Mock } from "vitest";
import { SYSTEM_MANAGED_ROLE_DELETE_ERROR_MESSAGE } from "../../constants.ts";
import { deleteRoleByIdDal, getRoleDal } from "../../dal/role.ts";
import { deleteRoleByIdService } from "../../services/role.ts";

vi.mock("../../dal/role.ts", () => ({
	deleteRoleByIdDal: vi.fn(),
	getRoleDal: vi.fn(),
}));

test("should not delete a system-managed role", async () => {
	const exec = vi.fn().mockResolvedValue({ systemManaged: true });
	(getRoleDal as Mock).mockReturnValue({ exec });

	await expect(
		deleteRoleByIdService("507f1f77bcf86cd799439012"),
	).rejects.toThrow(SYSTEM_MANAGED_ROLE_DELETE_ERROR_MESSAGE);
	expect(deleteRoleByIdDal).not.toHaveBeenCalled();
});
