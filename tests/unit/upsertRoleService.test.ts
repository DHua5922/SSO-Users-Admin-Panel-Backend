import { Types } from "mongoose";
import type { Mock } from "vitest";
import { EMPTY_ROLE_NAME_ERROR_MESSAGE } from "../../constants.ts";
import { upsertRoleDal } from "../../dal/role.ts";
import { upsertRoleService } from "../../services/role.ts";

const roleId = new Types.ObjectId();

const createRoleServiceInput = {
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

test("should throw error if name is empty", async () => {
	await expect(
		upsertRoleService({
			...createRoleServiceInput,
			name: "",
		}),
	).rejects.toThrow(EMPTY_ROLE_NAME_ERROR_MESSAGE);
});

test("should create a new role successfully", async () => {
	const createRoleResult = {
		_id: roleId,
		name: createRoleServiceInput.name,
		description: createRoleServiceInput.description,
	};
	const expectedResult = {
		...createRoleResult,
		_id: roleId.toHexString(),
	};

	mockUpsertRole(createRoleResult);
	await expect(upsertRoleService(createRoleServiceInput)).resolves.toEqual(
		expectedResult,
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

	const expectedUpdateRoleServiceResult = {
		...updateRoleResult,
		_id: roleId.toHexString(),
	};

	mockUpsertRole(updateRoleResult);
	await expect(upsertRoleService(updateRoleServiceInput)).resolves.toEqual(
		expectedUpdateRoleServiceResult,
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
