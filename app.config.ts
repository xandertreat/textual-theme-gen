import { defineConfig } from "@solidjs/start/config";

// Plugins
import tailwindcss from "@tailwindcss/vite";
import AutoImport from "unplugin-auto-import/vite";
import IconsResolver from "unplugin-icons/resolver";
import Icons from "unplugin-icons/vite";
// import tsconfigPaths from "vite-tsconfig-paths";

import path from "node:path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
	ssr: false,
	server: {
		node: true,
		preset: "node-server",
		prerender: {
			crawlLinks: true,
		},
	},
	vite: {
		plugins: [
			tailwindcss(),
			AutoImport({
				dts: "./src/auto-imports.d.ts",
				resolvers: [
					IconsResolver({
						prefix: "Icon",
						extension: "jsx",
					}),
				],
			}),
			Icons({ compiler: "solid", autoInstall: true }),
		],
		server: {
			allowedHosts: ["127.0.0.1", "localhost", "0.0.0.0"],
		},
		test: {
			include: ["./tests/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
			exclude: ["./tests/e2e/**/*"],
			globals: true,
			environment: "jsdom",
		},
		resolve: {
			alias: {
				// "~/*" → "./src/*"
				"~": path.resolve(__dirname, "src"),
				// "@ui/*" → "./src/components/ui/*"
				"@ui": path.resolve(__dirname, "src/components/ui"),
				// "@util" → "./src/lib/util.ts"
				"@util": path.resolve(__dirname, "src/lib/util.ts"),
			},
		},
	},
});
