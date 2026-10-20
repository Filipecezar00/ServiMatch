import "dotenv/config";
import mysql from "mysql2/promise";

const env = (globalThis as any).process?.env ?? {};

export const pool = mysql.createPool({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  port: Number(env.DB_PORT ?? 3306),
});
