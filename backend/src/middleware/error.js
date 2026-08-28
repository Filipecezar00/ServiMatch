import AppError from "../utils/AppError.js";
export default function errorMiddleware(erro, req, res, next) {
  if (erro instanceof AppError) {
    return res.status(erro.statusCode).json({ mensagem: erro.message });
  } else {
    console.error("Erro ao executar o middleware:", erro);
    return res.status(500).json({ message: "Erro interno,aguarde..." });
  }
}
