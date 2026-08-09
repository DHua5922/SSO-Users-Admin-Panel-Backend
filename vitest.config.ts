import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		restoreMocks: true,
		globals: true,
		setupFiles: ["./tests/vitest.setup.ts"],
	},
});
