"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const service_offered_repository_js_1 = require("./modules/services_offered/service_offered_repository.js");
(0, service_offered_repository_js_1.buscarCategoriaPorId)(2);
(0, service_offered_repository_js_1.buscarCategoriaPorId)(1);
(0, service_offered_repository_js_1.salvar)(1, "Meu serviço", "Descrição do serviço oferecido", 2);
