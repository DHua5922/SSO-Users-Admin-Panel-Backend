import type { Mock } from "vitest";
import {
	FORBIDDEN_STATUS_CODE,
	SYSTEM_MANAGED_ROLE_DELETE_ERROR_MESSAGE,
} from "../../constants.ts";
import { deleteRoleByIdDal, getRoleDal } from "../../dal/role.ts";
import { deleteRoleByIdService } from "../../services/role.ts";

vi.mock("../../dal/role.ts", () => ({
	deleteRoleByIdDal: vi.fn(),
	getRoleDal: vi.fn(),
}));

test("should not delete a system-managed role", async () => {
	const exec = vi.fn().mockResolvedValue({ systemManaged: true });
	(getRoleDal as Mock).mockReturnValue({ exec });

	const value = deleteRoleByIdService("507f1f77bcf86cd799439012");
	await expect(value).rejects.toMatchObject({
		message: SYSTEM_MANAGED_ROLE_DELETE_ERROR_MESSAGE,
		status: FORBIDDEN_STATUS_CODE,
	});
	expect(deleteRoleByIdDal).not.toHaveBeenCalled();
});
