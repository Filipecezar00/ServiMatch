import "dotenv/config";

import { cadastro } from "./modules/users/user.service.js";

const criar_usuario = await cadastro(
  "teste3",
  "teste3@gmail.com",
  "testando@1234",
);

console.log(criar_usuario);
