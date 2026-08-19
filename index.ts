import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Express } from "express";
import { z } from "zod";
import mongoose from "./config/database.ts";
import { REQUEST_ID_HEADER } from "./constants.ts";
import { requestIdMiddleware } from "./middleware/requestId.ts";
import authRouter from "./routes/auth.ts";
import dashboardRouter from "./routes/dashboard.ts";
import docsRouter from "./routes/docs.ts";
import homeRouter from "./routes/home.ts";
import meRouter from "./routes/me.ts";
import roleRouter from "./routes/role.ts";
import userRouter from "./routes/user.ts";

checkEnvVariables();
mongoose.connectToMongoDb();

const app: Express = express();
configureApp(app);

const shouldStartLocalServer =
	process.env.NODE_ENV !== "test" && process.env.VERCEL !== "1";

if (shouldStartLocalServer) {
	const port = process.env.PORT || 8080;
	app.listen(port, () => {
		console.log(`Server is running on port ${port}`);
	});
}

export default app;

function checkEnvVariables() {
	const envSchema = z.object({
		MONGO_URI: z.string(),
		ACCESS_TOKEN_NAME: z.string(),
		ACCESS_TOKEN_EXPIRATION: z.string(),
		REFRESH_TOKEN_NAME: z.string(),
		REFRESH_TOKEN_EXPIRATION: z.string(),
		JWT_SECRET: z.string(),
		CORS_ORIGIN: z.string(),
		GUEST_LOGIN_EMAIL: z.email(),
		GUEST_LOGIN_PASSWORD: z.string().min(8),
	});

	const envValidation = envSchema.safeParse(process.env);
	if (!envValidation.success) {
		console.error(
			"INVALID ENVIRONMENT VARIABLES:\n",
			z.treeifyError(envValidation.error),
		);
		process.exit(1);
	}
}

function configureApp(app: Express) {
	app.use(requestIdMiddleware);
	app.use(express.json());
	app.use(
		cors({
			origin: process.env.CORS_ORIGIN,
			credentials: true,
			allowedHeaders: ["Content-Type", "Authorization"],
			exposedHeaders: [REQUEST_ID_HEADER],
			methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		}),
	);
	app.use(cookieParser());

	app.use(homeRouter);
	app.use(authRouter);
	app.use(meRouter);
	app.use(userRouter);
	app.use(roleRouter);
	app.use(dashboardRouter);
	app.use(docsRouter);
}
