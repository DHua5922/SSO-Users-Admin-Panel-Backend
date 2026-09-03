import type { Mock } from "vitest";
import { inngest } from "../../clients/inngest.ts";
import {
	FORBIDDEN_STATUS_CODE,
	SYSTEM_MANAGED_USER_DELETE_ERROR_MESSAGE,
} from "../../constants.ts";
import { deleteUserByIdDal, getUserDal } from "../../dal/user.ts";
import { deleteUserByIdService } from "../../services/user.ts";

vi.mock("../../clients/inngest.ts", () => ({
	inngest: {
		send: vi.fn(),
	},
}));

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
	expect(inngest.send).not.toHaveBeenCalled();
});

test("should send a user deleted event after deleting a user in production", async () => {
	vi.stubEnv("NODE_ENV", "production");
	const userId = "507f1f77bcf86cd799439011";
	const deletedUser = { _id: userId };
	const exec = vi.fn().mockResolvedValue(deletedUser);
	const populate = vi.fn().mockReturnValue({ exec });

	(getUserDal as Mock).mockReturnValue({
		exec: vi.fn().mockResolvedValue({ systemManaged: false }),
	});
	(deleteUserByIdDal as Mock).mockReturnValue({ populate });
	(inngest.send as Mock).mockResolvedValue(undefined);

	await expect(deleteUserByIdService(userId)).resolves.toBe(deletedUser);
	expect(inngest.send).toHaveBeenCalledWith({
		name: "app/user.deleted",
		data: { userId },
	});
});

test("should not send a user deleted event outside production", async () => {
	vi.stubEnv("NODE_ENV", "test");
	const userId = "507f1f77bcf86cd799439011";
	const deletedUser = { _id: userId };
	const exec = vi.fn().mockResolvedValue(deletedUser);
	const populate = vi.fn().mockReturnValue({ exec });

	(getUserDal as Mock).mockReturnValue({
		exec: vi.fn().mockResolvedValue({ systemManaged: false }),
	});
	(deleteUserByIdDal as Mock).mockReturnValue({ populate });

	await expect(deleteUserByIdService(userId)).resolves.toBe(deletedUser);
	expect(inngest.send).not.toHaveBeenCalled();
});
