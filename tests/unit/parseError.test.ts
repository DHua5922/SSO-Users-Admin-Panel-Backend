import { ApiError } from "js-ts-kit";
import { TokenExpiredError } from "jsonwebtoken";
import {
	BAD_REQUEST_STATUS_CODE,
	INTERNAL_SERVER_ERROR_STATUS_CODE,
	UNAUTHORIZED_STATUS_CODE,
} from "../../constants.ts";
import { parseError } from "../../middleware/logging.ts";

test("should return default error message", () => {
	const errorMessage = "Default error message";
	const error = new Error(errorMessage);
	const value = parseError(error);

	expect(value.status).toEqual(INTERNAL_SERVER_ERROR_STATUS_CODE);
	expect(value.message).toEqual(errorMessage);
});

test("should return API error message", () => {
	const errorMessage = "API error message";
	const apiError = new ApiError(errorMessage, BAD_REQUEST_STATUS_CODE);
	const value = parseError(apiError);

	expect(value.status).toEqual(BAD_REQUEST_STATUS_CODE);
	expect(value.message).toEqual(errorMessage);
});

test("should return database error message", () => {
	const errorMessage = "Database error message";
	const databaseError = {
		name: "SequelizeDatabaseError",
		message: errorMessage,
	};
	const value = parseError(databaseError);

	expect(value.status).toEqual(INTERNAL_SERVER_ERROR_STATUS_CODE);
	expect(value.message).toEqual(errorMessage);
});

test("should return token expired error message", () => {
	const errorMessage = "Token expired error message";
	const tokenExpiredError = new TokenExpiredError(errorMessage, new Date());
	const value = parseError(tokenExpiredError);

	expect(value.status).toEqual(UNAUTHORIZED_STATUS_CODE);
	expect(value.message).toEqual(errorMessage);
});
