import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env" });

if (!process.env.POSTGRES_URL_NON_POOLING)
  throw new Error("Please provide the DATABASE_URL in your environment file");

export default defineConfig({
  schema: "./src/lib/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL_NON_POOLING,
  },
});
