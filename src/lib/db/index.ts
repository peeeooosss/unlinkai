import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

function getDb() {
  if (!_db) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    _db = drizzle(neon(url), { schema });
  }
  return _db;
}

export const db = new Proxy(
  {},
  {
    get(_target, prop) {
      if (prop === Symbol.toPrimitive || prop === "then" || prop === "toJSON") {
        return undefined;
      }
      const dbInstance = getDb();
      const value = (dbInstance as any)[prop];
      if (typeof value === "function") {
        return value.bind(dbInstance);
      }
      return value;
    },
  }
) as ReturnType<typeof drizzle<typeof schema>>;
