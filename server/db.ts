import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

// Hardcoded Supabase database URL (Password must be URL-encoded)
const databaseUrl = "postgresql://postgres.byvqyxvmepgtrlcnxjbz:rasal786786%40%40%40%40%40%40@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres";

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not configured");
}

// Optimized connection pool for high traffic (500+ concurrent users)
const pool = new pg.Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 30000,
  statement_timeout: 30000,
});

// Handle pool errors gracefully
pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err);
});

export const db = drizzle(pool, { schema });

