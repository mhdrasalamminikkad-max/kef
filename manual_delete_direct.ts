import { Pool } from 'pg';

const DATABASE_URL = "postgresql://kef_user:JSiN80Bww3WKOxt9x9LNNAoOlFibV7Z0@dpg-d4spbfkcjiac739oj9rg-a.singapore-postgres.render.com/kef";
const PROGRAM_ID = "58d6cebc-8102-47d7-b902-38c6a57683ad";

async function deleteFromDB() {
  const pool = new Pool({ 
    connectionString: DATABASE_URL,
    connectionTimeoutMillis: 15000,
    idleTimeoutMillis: 5000,
    max: 1,
  });
  
  let client;
  try {
    console.log("\n========== MANUAL DELETE (Direct SQL) ==========");
    console.log(`Target Program ID: ${PROGRAM_ID}\n`);

    console.log("Connecting to database...");
    client = await pool.connect();
    console.log("✓ Connected\n");

    // Step 1: Delete registrations
    console.log("Step 1: Deleting program registrations...");
    const regResult = await client.query(
      'DELETE FROM program_registrations WHERE program_id = $1',
      [PROGRAM_ID]
    );
    console.log(`✓ Deleted ${regResult.rowCount} registrations\n`);

    // Step 2: Delete program
    console.log("Step 2: Deleting program...");
    const progResult = await client.query(
      'DELETE FROM programs WHERE id = $1',
      [PROGRAM_ID]
    );
    console.log(`✓ Deleted ${progResult.rowCount} program(s)\n`);

    if (progResult.rowCount > 0) {
      console.log("✓✓✓ SUCCESS: Program deleted from database!");
    } else {
      console.log("⚠ Program not found (may already be deleted)");
    }

    console.log("==============================================\n");
  } catch (error: any) {
    console.error("\n✗ ERROR:", error.message);
    console.error("Code:", error.code);
    if (error.detail) console.error("Detail:", error.detail);
    process.exit(1);
  } finally {
    if (client) client.release();
    await pool.end();
    process.exit(0);
  }
}

deleteFromDB();
