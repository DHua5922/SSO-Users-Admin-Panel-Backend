import { Types } from "mongoose";
import type { Mock } from "vitest";
import { upsertRoleDal } from "../../dal/role.ts";
import { upsertRoleService } from "../../services/role.ts";

const roleId = new Types.ObjectId();

const createRoleServiceInput = {
	_id: undefined,
	name: "test role",
	description: "test role description",
};

vi.mock("../../utilities/security.ts", () => ({
	bcrypt: {
		hashPassword: vi.fn(),
	},
}));

vi.mock("../../dal/role.ts", () => ({
	upsertRoleDal: vi.fn(),
}));

test("should create a new role successfully", async () => {
	const createRoleResult = {
		_id: roleId,
		name: createRoleServiceInput.name,
		description: createRoleServiceInput.description,
	};
	mockUpsertRole(createRoleResult);
	await expect(upsertRoleService(createRoleServiceInput)).resolves.toEqual(
		createRoleResult,
	);
});

test("should update an existing role successfully", async () => {
	const updateRoleServiceInput = {
		_id: roleId.toHexString(),
		name: "updated role",
		description: "updated role description",
	};

	const updateRoleResult = {
		_id: roleId,
		name: updateRoleServiceInput.name,
		description: updateRoleServiceInput.description,
	};

	mockUpsertRole(updateRoleResult);
	await expect(upsertRoleService(updateRoleServiceInput)).resolves.toEqual(
		updateRoleResult,
	);
});

interface UpsertResult {
	_id: Types.ObjectId;
	name: string;
	description: string;
}
function mockUpsertRole(returnValue: UpsertResult) {
	const exec = vi.fn().mockResolvedValue(returnValue);
	const upsertRoleDalMock = upsertRoleDal as Mock;

	upsertRoleDalMock.mockReturnValue({ exec });
}
