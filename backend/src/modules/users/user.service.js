import AppError from "../../utils/AppError.js";
import bcrypt from "bcrypt";
import { buscarPorEmail, criar } from "./user.repository.js";

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

  return usuario;
}
