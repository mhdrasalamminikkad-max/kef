import { db } from "./server/db";
import { programs, programRegistrations } from "@shared/schema";
import { eq } from "drizzle-orm";

const PROGRAM_ID = "58d6cebc-8102-47d7-b902-38c6a57683ad";

async function deleteProgram() {
  try {
    console.log("\n========== MANUAL DELETE SCRIPT ==========");
    console.log(`Target Program ID: ${PROGRAM_ID}\n`);

    // Step 1: Delete registrations
    console.log("Step 1: Deleting program registrations...");
    const regDelete = await db
      .delete(programRegistrations)
      .where(eq(programRegistrations.programId, PROGRAM_ID));
    
    console.log(`✓ Deleted ${regDelete || 0} registrations\n`);

    // Step 2: Delete the program
    console.log("Step 2: Deleting program from database...");
    const progDelete = await db
      .delete(programs)
      .where(eq(programs.id, PROGRAM_ID));
    
    const deleted = (progDelete || 0) > 0;
    
    if (deleted) {
      console.log(`✓ Program successfully deleted!\n`);
      
      // Step 3: Verify deletion
      console.log("Step 3: Verifying deletion...");
      const remaining = await db
        .select()
        .from(programs)
        .where(eq(programs.id, PROGRAM_ID));
      
      if (remaining.length === 0) {
        console.log(`✓ Verification passed - program no longer exists\n`);
        console.log("=========================================");
        console.log("✓ SUCCESS: Program deleted from database!");
        console.log("=========================================\n");
      } else {
        console.warn(`Warning: Program still exists in database`);
      }
    } else {
      console.warn(`⚠ Program not found in database (may already be deleted)\n`);
    }

    process.exit(0);
  } catch (error: any) {
    console.error("\n✗ ERROR during deletion:");
    console.error("Message:", error?.message);
    console.error("Code:", error?.code);
    console.error("Detail:", error?.detail);
    console.error("\nFull error:", error);
    console.error("\n=========================================");
    process.exit(1);
  }
}

deleteProgram();
