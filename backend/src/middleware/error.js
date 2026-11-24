import AppError from "../utils/AppError.js";
export default function errorMiddleware(erro, req, res, next) {
  if(erro.type==="entity.too.large"){
    return res.status(413).json({
      message:"O tamanho da requisição excede o limite permitido."
    });
  }
  if (erro instanceof AppError) {
    return res.status(erro.statusCode).json({ mensagem: erro.message });
  } else {
    console.error("Erro ao executar o middleware:", erro);
    return res.status(500).json({ message: "Erro interno,aguarde..." });
  }
}
