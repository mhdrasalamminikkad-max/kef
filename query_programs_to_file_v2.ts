
import { db } from "./server/db";
import { programs } from "@shared/schema";
import * as fs from 'fs';

async function main() {
    const logFile = 'db_check_output_v2.txt';
    const log = (msg: string) => {
        console.log(msg);
        fs.appendFileSync(logFile, msg + '\n');
    };

    fs.writeFileSync(logFile, "--- START DB CHECK V2 ---\n");

    try {
        // Select ONLY specific columns to avoid errors with missing columns like 'register_url'
        const allPrograms = await db.select({
            id: programs.id,
            title: programs.title,
            status: programs.programStatus
        }).from(programs);

        if (allPrograms.length === 0) {
            log("No programs found in the database.");
        } else {
            log(`Found ${allPrograms.length} programs in the database:`);
            allPrograms.forEach(p => {
                log(`Title: "${p.title}" | Status: ${p.status} | ID: ${p.id}`);
            });
        }
    } catch (error: any) {
        log("Error querying database:");
        log(JSON.stringify(error, null, 2));
        if (error.message) log(error.message);
    }
    log("--- END DB CHECK V2 ---");
    process.exit(0);
}

main();
