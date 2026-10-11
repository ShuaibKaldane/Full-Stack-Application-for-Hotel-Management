import mysql from 'mysql2/promise';
import 'dotenv/config';

const configured = Boolean(process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME);
export const pool = configured ? mysql.createPool({
  host: process.env.DB_HOST, port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER, password: process.env.DB_PASSWORD || '', database: process.env.DB_NAME,
  waitForConnections: true, connectionLimit: 10, dateStrings: true
}) : null;

export async function query(sql, params = []) {
  if (!pool) throw new Error('Database is not configured. Copy .env.example to .env and configure MySQL.');
  try { const [rows] = await pool.execute(sql, params); return rows; }
  catch (error) { error.publicMessage = `Database error: ${error.code || error.message}`; throw error; }
}

export function dbError(error) {
  if (error.message?.startsWith('Database is not configured')) return error.message;
  return error.publicMessage || (error.code === 'ECONNREFUSED'
    ? 'Database unavailable. Start MySQL and verify DB_* settings.'
    : 'Database request failed. Verify the MySQL schema and connection settings.');
}
