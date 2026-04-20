
import { db } from "./server/db";
import { programs } from "@shared/schema";

async function main() {
    console.log("--- START DB CHECK ---");
    try {
        const allPrograms = await db.select().from(programs);

        if (allPrograms.length === 0) {
            console.log("No programs found in the database.");
        } else {
            console.log(`Found ${allPrograms.length} programs in the database:`);
            allPrograms.forEach(p => {
                console.log(`ID: ${p.id} | Title: "${p.title}" | Status: ${p.programStatus}`);
            });
        }
    } catch (error) {
        console.error("Error querying database:", error);
    }
    console.log("--- END DB CHECK ---");
    process.exit(0);
}

main();
