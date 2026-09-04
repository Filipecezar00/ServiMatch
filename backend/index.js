import "dotenv/config";
import express from "express";
import { pool } from "./src/config/database.js";
import errorMiddleware from "./src/middleware/error.js";
import user_router from "./src/modules/users/users.routes.js";
import service_router_wanted from "./src/modules/services_wanted/service_wanted_routes.js";
import service_router_offered from "./src/modules/services_offered/service_offered_routes.js";
import exchange_proposal_router from "./src/modules/exchange_proposals/exchange_proposal_routes.js";
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

app.use("/api/users", user_router);
app.use("/api/services-offered", service_router_offered);
app.use("/api/services-wanted", service_router_wanted);
app.use("/api/exchange-proposals", exchange_proposal_router);
app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando em porta ${process.env.PORT}`);
});
