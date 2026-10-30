"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = errorMiddleware;
const AppError_js_1 = __importDefault(require("../utils/AppError.js"));
function errorMiddleware(erro, req, res, next) {
    if (erro instanceof AppError_js_1.default) {
        return res.status(erro.statusCode).json({ mensagem: erro.message });
    }
    else {
        console.error("Erro ao executar o middleware:", erro);
        return res.status(500).json({ message: "Erro interno,aguarde..." });
    }
}
