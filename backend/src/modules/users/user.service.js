import "dotenv/config";
import AppError from "../../utils/AppError.js";
import bcrypt from "bcrypt";
import { buscarPorEmail, criar } from "./user.repository.js";
import jwt from "jsonwebtoken";

export async function cadastro(nome, email, senha) {
  if (!email || !senha || !nome) {
    throw new AppError("Dados obrigatorios ausentes", 400);
  }

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const teste_email = regex.test(email);

  if (!teste_email) {
    throw new AppError("Formato Inválido", 400);
  }

  if (nome.trim().length < 3) {
    throw new AppError("Nome muito curto", 400);
  }

  if (senha.trim().length < 8) {
    throw new AppError("Senha muita curta", 400);
  }

  const resultado = await buscarPorEmail(email);
  if (resultado) {
    throw new AppError("Email já cadastrado", 409);
  }

  const senha_hash = await bcrypt.hash(senha, 10);

  const id = await criar(nome, email, senha_hash);

  const usuario = { id, nome, email };

  const token = jwt.sign({ id: usuario.id }, process.env.TOKEN_JWT, {
    expiresIn: "1d",
  });

  return { usuario, token };
}

export async function autenticar(email, senha) {
  if (!email || !senha) {
    throw new AppError("Credenciais Incompletas", 400);
  }

  const resposta = await buscarPorEmail(email);
  if (!resposta) {
    throw new AppError("Email ou senha Incorretos", 401);
  }

  const validar_senha = await bcrypt.compare(senha, resposta.senha);

  if (!validar_senha) {
    throw new AppError("Email ou senha Incorretos", 401);
  }

  const id = resposta.id;
  const nome = resposta.nome;

  const payload = {
    id,
    nome,
    email,
  };
  const token_jwt = jwt.sign(payload, process.env.TOKEN_JWT, {
    expiresIn: "1h",
  });

  return { token: token_jwt, usuario: { id, nome, email } };
}
