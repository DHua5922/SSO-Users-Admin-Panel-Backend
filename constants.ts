export const SUCCESS_STATUS_CODE = 200;
export const BAD_REQUEST_STATUS_CODE = 400;
export const UNAUTHORIZED_STATUS_CODE = 401;
export const FORBIDDEN_STATUS_CODE = 403;
export const INTERNAL_SERVER_ERROR_STATUS_CODE = 500;

export const REQUEST_ID_HEADER = "X-Request-ID";

export const NOT_AN_ADMIN_LOGIN_ERROR_MESSAGE = "Only admins can log in";
export const INVALID_LOGIN_CREDENTIALS_ERROR_MESSAGE =
	"Invalid email or password";
export const WRONG_ROLE_ERROR_MESSAGE =
	"Only administrators can use this route";
export const UNAUTHORIZED_ERROR_MESSAGE = "Not authorized to use this route";
export const SYSTEM_MANAGED_USER_DELETE_ERROR_MESSAGE =
	"System-managed users cannot be deleted";
export const SYSTEM_MANAGED_ROLE_DELETE_ERROR_MESSAGE =
	"System-managed roles cannot be deleted";

export const EMPTY_PASSWORD_ERROR_MESSAGE =
	"Password is required for new users";

export const INVALID_ACCESS_TOKEN_ERROR_MESSAGE = "Invalid access token";
export const INVALID_REFRESH_TOKEN_ERROR_MESSAGE = "Invalid refresh token";

export const ADMIN_KEY = "admin";
