import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL 
  || "postgresql://kef_user:JSiN80Bww3WKOxt9x9LNNAoOlFibV7Z0@dpg-d4spbfkcjiac739oj9rg-a.singapore-postgres.render.com/kef";

if (!databaseUrl) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
