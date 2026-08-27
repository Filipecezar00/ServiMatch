import "dotenv/config";

import { buscarPorEmail, criar } from "./modules/users/user.repository.js";

const usuario = await buscarPorEmail("teste@teste.com");
console.log(usuario);
