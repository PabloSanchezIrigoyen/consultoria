// src/db.ts
import 'dotenv/config';
import mysql from 'mysql2/promise';

const {
  DB_HOST = '127.0.0.1',
  DB_PORT = '3306',
  DB_USER = 'root',
  DB_PASS = '',
  DB_NAME = 'constructora_app',
} = process.env;

export const pool = mysql.createPool({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true,
  dateStrings: true,
});


export async function ping() {
  const conn = await pool.getConnection();
  try {
    await conn.ping();
    return true;
  } finally {
    conn.release();
  }
}
