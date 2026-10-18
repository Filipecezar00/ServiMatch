import "dotenv/config";
import express from "express";
import { pool } from "./src/config/database.js";
import errorMiddleware from "./src/middleware/error.js";
import user_router from "./src/modules/users/users.routes.js";
import service_router_wanted from "./src/modules/services_wanted/service_wanted_routes.js";
import service_router_offered from "./src/modules/services_offered/service_offered_routes.js";
import exchange_proposal_router from "./src/modules/exchange_proposals/exchange_proposal_routes.js";
import exchange_router from "./src/modules/exchanges/exchanges.routes.js";
import review_router from "./src/modules/reviews/reviews.routes.js";
import profile_router from "./src/modules/profile/profile.routes.js";
import { setupSwagger } from "./src/config/swagger.js";
import conversas_router from "./src/modules/conversas/conversas.routes.js"; "./src/modules/conversas/conversas.routes.js"
import { createServer } from "node:http";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./src/types/socket.js";
import { authSocket } from "./src/middleware/authSocket.js";
import {buscaUsuarioId_service,inserirMensagem_service,marcaComoLida_service} from "./src/modules/conversas/conversas.service.js"

const app = express();
app.use(express.json());

const httpServer = createServer(app);

const io: Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
> = new Server(httpServer, {
  cors: { origin: "*" },
});
io.use(authSocket);

setupSwagger(app);

app.get("/health", async (req, res) => {
  try {
    const consulta = await pool.query(`SELECT 1`);
    res.status(200).json({ status: "ok", database: "connected" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", database: "Erro ao executar servidor" });
  }
});

app.use("/api/users", user_router);
app.use("/api/services-offered", service_router_offered);
app.use("/api/services-wanted", service_router_wanted);
app.use("/api/exchange-proposals", exchange_proposal_router);
app.use("/api/exchange", exchange_router);
app.use("/api/reviews", review_router);
app.use("/api/profile", profile_router);
app.use("/api/conversas",conversas_router)
app.use(errorMiddleware);

io.on("connection", async (socket) => {
socket.on("join_room", async (payload:{roomId:number}) => {
    try{
    let usuarioId = socket.data.user.id;
    let consulta_banco = await buscaUsuarioId_service(usuarioId,payload.roomId)
  if(consulta_banco){
      socket.join(`conversa:${payload.roomId}`)
}
    }catch(error:any){
      socket.emit("error_message",error.message)
    }
})


socket.on("read_message",async (payload:{conversaId:number,mensagemId:number})=>{
  try{
    const usuarioId = socket.data.user.id; 

    const resultado = await marcaComoLida_service({
      conversaId:payload.conversaId,
      mensagemId:payload.mensagemId, 
      usuarioId
    }); 

    if(!resultado){
      return; 
    }

    io.to(`conversa:${payload.conversaId}`).emit("read_message",resultado,); 
  }catch(error:any){
    socket.emit("error_message",error.message)
  }
})


 socket.on("send_message",async ({roomId,mensagem}:{roomId:number;mensagem:string})=>{
     try{
      let usuarioId = socket.data.user.id
      let mensagem_enviada = await inserirMensagem_service(roomId,usuarioId,mensagem);

      io.to(`conversa:${roomId}`).emit("receive_message",mensagem_enviada)
     }catch(error:any){
      socket.emit("error_message",error.message)
     }
    })

  socket.on("disconnect", () => {
    console.log("Usuário desconectado:", socket.data.user.id);
  });
});
httpServer.listen(process.env.PORT, () => {
  console.log(`Servidor rodando em porta ${process.env.PORT}`);
});
