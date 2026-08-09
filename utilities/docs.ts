import {
	OpenAPIRegistry,
	OpenApiGeneratorV3,
	type RouteConfig,
} from "@asteasolutions/zod-to-openapi";
import express, { type RequestHandler } from "express";

const registry = new OpenAPIRegistry();

export function generateOpenApiDocument() {
	const generator = new OpenApiGeneratorV3(registry.definitions);

	return generator.generateDocument({
		openapi: "3.0.0",
		info: {
			title: "My API",
			version: "1.0.0",
			description: "This is my API documentation",
		},
		servers: [
			{
				url: "/",
			},
		],
	});
}

export function createDocumentedRoute(basePath = "") {
	const router = express.Router();

	const route = (routeConfig: RouteConfig, ...handlers: RequestHandler[]) => {
		const fullUrl = `${basePath}${routeConfig.path}`;
		const method = routeConfig.method.toLowerCase() as keyof typeof router;
		const routerFn = router[method] as (
			path: string,
			...handlers: RequestHandler[]
		) => void;

		registry.registerPath({
			...routeConfig,
			path: fullUrl,
		});
		routerFn.call(router, fullUrl, ...handlers);
	};

	return { router, route };
}
