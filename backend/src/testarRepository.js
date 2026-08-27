import "dotenv/config";

import { buscarPorEmail, criar } from "./modules/users/user.repository.js";

const usuario = await buscarPorEmail("teste@teste.com");
const criar_usuario = await criar("teste", "teste@gmail.com", "testando123");
console.log(usuario);
console.log(criar_usuario);
