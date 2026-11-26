import "dotenv/config";
import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  ssl:{
    minVersion:"TLSv1.2",
    rejectUnauthorized:true,
  }, 
  waitForConnections:true,
  connectionLimit:10,
  maxIdle:5,
  idleTimeout:60000,
  queueLimit:0,
  enableKeepAlive:true,
});
