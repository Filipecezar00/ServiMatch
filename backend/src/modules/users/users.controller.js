import { cadastro, autenticar } from "./user.service.js";

export async function criarUsuario(req, res) {
  const nome = req.body.nome;
  const email = req.body.email;
  const senha = req.body.senha;
  const usuario = await cadastro(nome, email, senha);

  return res.status(201).json(usuario);
}

export async function loginUsuario(req, res) {
  const email = req.body.email;
  const senha = req.body.senha;

  const usuario = await autenticar(email, senha);

  return res.status(200).json({ usuario });
}
