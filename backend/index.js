import "dotenv/config";
import express from "express";
import { pool } from "./src/config/database.js";
import errorMiddleware from "./src/middleware/error.js";
import AppError from "./src/utils/AppError.js";
const app = express();

app.use(express.json());

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

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando em porta ${process.env.PORT}`);
});
