import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@db/schema";
import * as relations from "@db/relations";

const fullSchema = { ...schema, ...relations };

let instance: any = null;

export function getDb() {
  if (!instance) {
    const pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
    });
    instance = drizzle(pool, { schema: fullSchema });
  }
  return instance;
}
