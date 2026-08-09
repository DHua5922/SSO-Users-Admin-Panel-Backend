import express from "express";
import { loginController } from "../controllers/auth.ts";
import {
	errorLoggingMiddleware,
	loggingMiddleware,
} from "../middleware/logging.ts";

const router = express.Router();

router.post(
	"/login",
	loggingMiddleware,
	errorLoggingMiddleware(loginController),
);

export default router;
