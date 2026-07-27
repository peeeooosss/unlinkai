import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { resolve } from "path";

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  const sql = neon(DATABASE_URL);
  const migration = readFileSync(resolve(import.meta.dirname, "../scripts/migrate-lms.sql"), "utf-8");
  
  const statements = migration
    .split(";")
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith("--"));

  for (const stmt of statements) {
    try {
      await sql`${sql(stmt)}`;
      console.log("OK:", stmt.substring(0, 80));
    } catch (e) {
      const msg = e && e.message ? e.message : String(e);
      if (msg.includes("already exists")) {
        console.log("SKIP:", stmt.substring(0, 80));
      } else {
        console.error("ERR:", stmt.substring(0, 80));
        console.error("  ", msg);
      }
    }
  }
  
  console.log("\nMigration complete!");
}

main().catch(console.error);