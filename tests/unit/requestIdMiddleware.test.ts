import type { NextFunction, Request, Response } from "express";
import { REQUEST_ID_HEADER } from "../../constants.ts";
import { requestIdMiddleware } from "../../middleware/requestId.ts";
import type { RequestWithRequestId } from "../../types/request.ts";

test("should generate a request ID and return it in the response header", () => {
	const req = {} as Request;
	const setHeader = vi.fn();
	const res = { setHeader } as unknown as Response;
	const next = vi.fn() as NextFunction;

	requestIdMiddleware(req, res, next);

	const requestId = (req as RequestWithRequestId).requestId;
	expect(requestId).toMatch(
		/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
	);
	expect(setHeader).toHaveBeenCalledWith(REQUEST_ID_HEADER, requestId);
	expect(next).toHaveBeenCalledOnce();
});
