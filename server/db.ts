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

// Auto-initialize program_registrations table and columns
export async function initTables() {
  try {
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS program_registrations (
          id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
          program_id VARCHAR NOT NULL,
          full_name TEXT NOT NULL,
          age TEXT,
          email TEXT NOT NULL,
          phone TEXT NOT NULL,
          country_code TEXT NOT NULL DEFAULT '+91',
          company TEXT,
          designation TEXT,
          is_member BOOLEAN NOT NULL DEFAULT false,
          membership_number TEXT,
          attendee_type TEXT DEFAULT 'first-time',
          affiliation TEXT DEFAULT 'not-affiliated',
          expectations TEXT,
          payment_screenshot TEXT,
          status TEXT NOT NULL DEFAULT 'pending',
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
        ALTER TABLE program_registrations ADD COLUMN IF NOT EXISTS payment_screenshot TEXT;
        ALTER TABLE program_registrations ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
        ALTER TABLE program_registrations ALTER COLUMN attendee_type DROP NOT NULL;
        ALTER TABLE program_registrations ALTER COLUMN affiliation DROP NOT NULL;
      `);
      console.log('[DB INIT] ✓ program_registrations table verified/created in database');
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('[DB INIT ERROR] Failed to initialize program_registrations table:', err);
  }
}
initTables();

