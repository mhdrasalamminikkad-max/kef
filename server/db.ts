import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

// Hardcoded database URL using Render internal url format
const databaseUrl = "postgresql://kef_user:JSiN80Bww3WKOxt9x9LNNAoOlFibV7Z0@dpg-d4spbfkcjiac739oj9rg-a/kef";

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

