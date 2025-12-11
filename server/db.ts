import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

// Priority: EXTERNAL_DATABASE_URL (Render/external) > RAILWAY_DATABASE_URL > DATABASE_URL (Replit built-in)
const databaseUrl = process.env.EXTERNAL_DATABASE_URL 
  || process.env.RAILWAY_DATABASE_URL 
  || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL or RAILWAY_DATABASE_URL environment variable is not set");
}

// Optimized connection pool for high traffic (500+ concurrent users)
const pool = new pg.Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
  max: 20, // Maximum number of connections in the pool
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 10000, // Timeout for new connections
});

// Handle pool errors gracefully
pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err);
});

export const db = drizzle(pool, { schema });
