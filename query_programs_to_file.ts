
import { db } from "./server/db";
import { programs } from "@shared/schema";
import * as fs from 'fs';

async function main() {
    const logFile = 'db_check_output.txt';
    const log = (msg: string) => {
        console.log(msg);
        fs.appendFileSync(logFile, msg + '\n');
    };

    fs.writeFileSync(logFile, "--- START DB CHECK ---\n");

    try {
        const allPrograms = await db.select().from(programs);

        if (allPrograms.length === 0) {
            log("No programs found in the database.");
        } else {
            log(`Found ${allPrograms.length} programs in the database:`);
            allPrograms.forEach(p => {
                log(`ID: ${p.id} | Title: "${p.title}" | Status: ${p.programStatus}`);
            });
        }
    } catch (error: any) {
        log("Error querying database:");
        log(JSON.stringify(error, null, 2));
        if (error.message) log(error.message);
        if (error.stack) log(error.stack);
    }
    log("--- END DB CHECK ---");
    process.exit(0);
}

main();
