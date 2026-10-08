import "dotenv/config";
import { Pool, types } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL must be configured for the Supabase PostgreSQL connection.");
}

types.setTypeParser(20, (value) => Number(value));

export const pool = new Pool({
  connectionString,
  ssl: /localhost|127\.0\.0\.1|@db:/.test(connectionString)
    ? undefined
    : { rejectUnauthorized: false },
  max: 10,
});

export async function ping() {
  await pool.query("SELECT 1");
  return true;
}
