import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { resolve } from "path";

const DATABASE_URL = "postgresql://neondb_owner:npg_OjVYdH7Q1ZnI@ep-fancy-star-az49zkms-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

async function main() {
  const sql = neon(DATABASE_URL);
  
  // First, let's test if basic queries work
  const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`;
  console.log("Existing tables:", tables.map(t => t.table_name).join(", "));
  
  // Now try creating one table as test
  try {
    await sql`CREATE TABLE IF NOT EXISTS test_migration (id text PRIMARY KEY, name text)`;
    console.log("Test table created successfully");
    await sql`DROP TABLE test_migration`;
    console.log("Test table dropped");
  } catch (e) {
    console.error("Test failed:", e.message);
  }
}

main().catch(console.error);