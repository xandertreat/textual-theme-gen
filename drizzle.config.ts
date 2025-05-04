import "dotenv/config";
import process from "node:process";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "sqlite",
	out: process.env.DATABASE_MIGRATIONS_URL as string,
	schema: "./**/drizzle/schema.{ts,js}",
	dbCredentials: {
		url: process.env.DATABASE_URL as string,
	},
});
