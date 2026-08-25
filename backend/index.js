import "dotenv/config";
import mysql from "mysql2/promise";
import express from "express";

const app = express();

app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.get("/health", async (req, res) => {
  try {
    const consulta = await pool.query(`SELECT 1`);
    res.status(200).json({ status: "ok", database: "connected" });
  } catch (error) {
    console.log("ERRO AO EXECUTAR CARREGAMENTO DO SERVIDOR:", error);
    return res
      .status(500)
      .json({ status: "error", database: "Erro ao executar servidor" });
  }
});
app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando em porta ${process.env.PORT}`);
});
