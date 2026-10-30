"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const database_js_1 = require("./src/config/database.js");
const error_js_1 = __importDefault(require("./src/middleware/error.js"));
const users_routes_js_1 = __importDefault(require("./src/modules/users/users.routes.js"));
const service_wanted_routes_js_1 = __importDefault(require("./src/modules/services_wanted/service_wanted_routes.js"));
const service_offered_routes_js_1 = __importDefault(require("./src/modules/services_offered/service_offered_routes.js"));
const exchange_proposal_routes_js_1 = __importDefault(require("./src/modules/exchange_proposals/exchange_proposal_routes.js"));
const exchanges_routes_js_1 = __importDefault(require("./src/modules/exchanges/exchanges.routes.js"));
const reviews_routes_js_1 = __importDefault(require("./src/modules/reviews/reviews.routes.js"));
const profile_routes_js_1 = __importDefault(require("./src/modules/profile/profile.routes.js"));
const swagger_js_1 = require("./src/config/swagger.js");
const conversas_routes_js_1 = __importDefault(require("./src/modules/conversas/conversas.routes.js"));
"./src/modules/conversas/conversas.routes.js";
const node_http_1 = require("node:http");
const socket_io_1 = require("socket.io");
const authSocket_js_1 = require("./src/middleware/authSocket.js");
const conversas_service_js_1 = require("./src/modules/conversas/conversas.service.js");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const httpServer = (0, node_http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: { origin: "*" },
});
io.use(authSocket_js_1.authSocket);
(0, swagger_js_1.setupSwagger)(app);
app.get("/health", async (req, res) => {
    try {
        const consulta = await database_js_1.pool.query(`SELECT 1`);
        res.status(200).json({ status: "ok", database: "connected" });
    }
    catch (error) {
        return res
            .status(500)
            .json({ status: "error", database: "Erro ao executar servidor" });
    }
});
app.use("/api/users", users_routes_js_1.default);
app.use("/api/services-offered", service_offered_routes_js_1.default);
app.use("/api/services-wanted", service_wanted_routes_js_1.default);
app.use("/api/exchange-proposals", exchange_proposal_routes_js_1.default);
app.use("/api/exchange", exchanges_routes_js_1.default);
app.use("/api/reviews", reviews_routes_js_1.default);
app.use("/api/profile", profile_routes_js_1.default);
app.use("/api/conversas", conversas_routes_js_1.default);
app.use(error_js_1.default);
io.on("connection", async (socket) => {
    socket.on("join_room", async (payload) => {
        try {
            let usuarioId = socket.data.user.id;
            let consulta_banco = await (0, conversas_service_js_1.buscaUsuarioId_service)(usuarioId, payload.roomId);
            if (consulta_banco) {
                socket.join(`conversa:${payload.roomId}`);
            }
        }
        catch (error) {
            socket.emit("error_message", error.message);
        }
    });
    socket.on("read_message", async (payload) => {
        try {
            const usuarioId = socket.data.user.id;
            const resultado = await (0, conversas_service_js_1.marcaComoLida_service)({
                conversaId: payload.conversaId,
                mensagemId: payload.mensagemId,
                usuarioId
            });
            if (!resultado) {
                return;
            }
            io.to(`conversa:${payload.conversaId}`).emit("read_message", resultado);
        }
        catch (error) {
            socket.emit("error_message", error.message);
        }
    });
    socket.on("send_message", async ({ roomId, mensagem }) => {
        try {
            let usuarioId = socket.data.user.id;
            let mensagem_enviada = await (0, conversas_service_js_1.inserirMensagem_service)(roomId, usuarioId, mensagem);
            io.to(`conversa:${roomId}`).emit("receive_message", mensagem_enviada);
        }
        catch (error) {
            socket.emit("error_message", error.message);
        }
    });
    socket.on("disconnect", () => {
        console.log("Usuário desconectado:", socket.data.user.id);
    });
});
httpServer.listen(process.env.PORT, () => {
    console.log(`Servidor rodando em porta ${process.env.PORT}`);
});
