if (process.env.TEST_TYPE === "integration") {
	const [{ default: request }, { app }] = await Promise.all([
		import("supertest"),
		import("../index.ts"),
	]);

	const cookies = request.cookies;
	const standardCookieOptions = {
		httpOnly: true,
		secure: true,
	};
	const cookieConfigList = [
		{ name: process.env.ACCESS_TOKEN_NAME, sameSite: "lax" },
		{ name: process.env.REFRESH_TOKEN_NAME, sameSite: "strict" },
	];

	const response = await request(app).post("/api/v1/auth/login").send({
		email: process.env.TEST_LOGIN_EMAIL,
		password: process.env.TEST_LOGIN_PASSWORD,
	});

	expect(response.status).toBe(200);
	expect(response.body._id).toBeTruthy();
	expect(response.body.username).toBeTruthy();
	expect(response.body.email).toBeTruthy();
	expect(response.body.role).toBeTruthy();
	expect(response.body.password).toBeUndefined();

	cookieConfigList.forEach(({ name, sameSite }) => {
		expect(
			cookies.set({
				name: name || "",
				options: {
					...standardCookieOptions,
					sameSite,
				},
			}),
		);
	});
}
