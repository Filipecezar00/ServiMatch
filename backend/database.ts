import "dotenv/config";
import mysql from "mysql2/promise";

const env = (globalThis as typeof globalThis & {
  process: { env: Record<string, string | undefined> };
}).process.env;

const requiredEnv = [
  "DB_HOST",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
]; 

for(const variable of requiredEnv){
  if(!env[variable]){
    throw new Error(`Variavel de ambiente obrigatória ausente: ${variable}`)
  }
}



export const pool = mysql.createPool({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  port: Number(env.DB_PORT ?? 3306),
  ssl:{
    minVersion:"TLSv1.2",
    rejectUnauthorized:true,
  },
  waitForConnections:true,
  connectionLimit:10,
  maxIdle:5,
  idleTimeout:60000,
  queueLimit:0,
  enableKeepAlive:true
});
