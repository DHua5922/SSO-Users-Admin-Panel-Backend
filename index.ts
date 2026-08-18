import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Express } from "express";
import swaggerUi from "swagger-ui-express";
import { z } from "zod";
import mongoose from "./config/database.ts";
import authRouter from "./routes/auth.ts";
import dashboardRouter from "./routes/dashboard.ts";
import homeRouter from "./routes/home.ts";
import meRouter from "./routes/me.ts";
import roleRouter from "./routes/role.ts";
import userRouter from "./routes/user.ts";
import { generateOpenApiDocument } from "./utilities/docs.ts";

checkEnvVariables();
mongoose.connectToMongoDb();

export const app: Express = express();
runServer(app);

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

function runServer(app: Express) {
	app.use(express.json());
	app.use(
		cors({
			origin: process.env.CORS_ORIGIN,
			credentials: true,
			allowedHeaders: ["Content-Type", "Authorization"],
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

	app.use(
		"/docs",
		swaggerUi.serve,
		swaggerUi.setup(generateOpenApiDocument(), {
			swaggerOptions: {
				withCredentials: true,
			},
		}),
	);

	const port = process.env.PORT || 8080;
	app.listen(port, () => {
		console.log(`Server is running on port ${port}`);
	});
}
