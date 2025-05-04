import { defineConfig } from "@solidjs/start/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	vite: {
		plugins: [tsconfigPaths()],
		ssr: { external: ["drizzle-orm"] },
		server: {
			allowedHosts: [
				"127.0.0.1",
				"localhost",
				"0.0.0.0",
				import.meta.env.BASE_URL,
			],
		},
		test: {
			include: ["./tests/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
			exclude: ["./tests/e2e/**/*"],
			globals: true,
			environment: "jsdom",
		},
	},
	middleware: "./src/middleware.ts",
});
