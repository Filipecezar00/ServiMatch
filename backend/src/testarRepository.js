import "dotenv/config";

import {
  salvar,
  buscarCategoriaPorId,
} from "./modules/services_offered/service_offered_repository.js";

buscarCategoriaPorId(2);
buscarCategoriaPorId(1);
salvar(1, "Meu serviço", "Descrição do serviço oferecido", 2);
