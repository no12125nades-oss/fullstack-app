import { getDb } from "../api/queries/connection";
import { teams } from "./schema";

async function test() {
  console.log("Testing DB connection...");
  try {
    const db = getDb();
    console.log("DB instance created");
    const result = await db.select().from(teams).limit(1);
    console.log("Query success, found", result.length, "rows");
    process.exit(0);
  } catch (e: any) {
    console.error("Error:", e.message);
    process.exit(1);
  }
}

test();
