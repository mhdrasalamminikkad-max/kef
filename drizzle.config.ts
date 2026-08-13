import { defineConfig } from "drizzle-kit";

// Use the same Supabase database URL as server/db.ts
const databaseUrl = process.env.DATABASE_URL
  || "postgresql://postgres.byvqyxvmepgtrlcnxjbz:rasal786786%40%40%40%40%40%40@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres";

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

