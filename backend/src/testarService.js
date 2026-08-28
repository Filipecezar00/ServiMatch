import "dotenv/config";
import { autenticar } from "./modules/users/user.service.js";

try {
  const resultado = await autenticar("teste3@gmail.com", "testando@1234");
  console.log("RESULTADO 1:", resultado);
} catch (error) {
  console.error("Erro ao gerar resultado 1", error);
}

try {
  const resultado_2 = await autenticar("email@gmail.com");
  console.log("RESULTADO 2:", resultado_2);
} catch (error) {
  console.error("Erro ao gerar Resultado 2", error);
}

try {
  const resultado_3 = await autenticar("teste@gmail.com", "testando");
  console.log("RESULTADO 3:", resultado_3);
} catch (error) {
  console.error("Erro ao gerar Resultado 3", error);
}
