"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.criar_service = criar_service;
exports.listar_ativos_service = listar_ativos_service;
exports.listar_meusAtivos_service = listar_meusAtivos_service;
exports.editar_servico_service = editar_servico_service;
exports.editar_statusServico_service = editar_statusServico_service;
exports.buscarServicoPorId_service = buscarServicoPorId_service;
exports.listarCategorias_service = listarCategorias_service;
const AppError_js_1 = __importDefault(require("../../utils/AppError.js"));
const service_wanted_repository_js_1 = require("../services_wanted/service_wanted.repository.js");
let categoriasCache = null;
async function criar_service(user_id, titulo, descricao, categoryId) {
    if (!titulo || !descricao) {
        throw new AppError_js_1.default("Campos obrigatórios ausentes", 400);
    }
    if (titulo.trim().length < 3 || titulo.trim().length > 200) {
        throw new AppError_js_1.default("O titulo deve conter entre 3 a 200 caracteres", 400);
    }
    if (descricao.trim().length < 10) {
        throw new AppError_js_1.default("A descrição deve ter no mínimo 10 caracteres", 400);
    }
    if (!categoryId) {
        categoryId = null;
    }
    else {
        const resposta = await (0, service_wanted_repository_js_1.buscarCategoriaPorId)(categoryId);
        if (!resposta) {
            throw new AppError_js_1.default("Categoria não encontrada", 404);
        }
    }
    const dados_solicitacao = await (0, service_wanted_repository_js_1.salvar)(user_id, titulo, descricao, categoryId);
    return dados_solicitacao;
}
async function listar_ativos_service() {
    const servicos_ativos = await (0, service_wanted_repository_js_1.listar_ativos)();
    return servicos_ativos;
}
async function listar_meusAtivos_service(userId) {
    const resposta = await (0, service_wanted_repository_js_1.listar_meusServicos)(userId);
    return resposta;
}
async function editar_servico_service(id, userId, titulo, descricao, categoryId) {
    const servico = await (0, service_wanted_repository_js_1.buscarServicoPorId)(id);
    if (!servico || Number(servico.user_id) !== Number(userId)) {
        throw new AppError_js_1.default("Serviço não encontrado", 404);
    }
    const tituloFinal = titulo ?? servico.titulo;
    const descricaoFinal = descricao ?? servico.descricao;
    const categoriaFinal = categoryId ?? servico.category_id;
    if (titulo !== undefined) {
        if (!titulo || titulo.trim().length < 3 || titulo.trim().length > 200) {
            throw new AppError_js_1.default("O titulo deve conter entre 3 e 200 caracteres", 400);
        }
    }
    if (descricao !== undefined) {
        if (!descricao ||
            descricao.trim().length < 10 ||
            descricao.trim().length > 1000) {
            throw new AppError_js_1.default("A descrição deve conter entre 10 e 1000 caracteres", 400);
        }
    }
    if (categoryId !== undefined && categoryId !== null) {
        const categoriaExiste = await (0, service_wanted_repository_js_1.buscarCategoriaPorId)(categoryId);
        if (!categoriaExiste) {
            throw new AppError_js_1.default("Categoria informada não existe", 400);
        }
    }
    await (0, service_wanted_repository_js_1.editar_servico_repository)(id, tituloFinal, descricaoFinal, categoriaFinal);
    return {
        id: Number(id),
        titulo: tituloFinal,
        descricao: descricaoFinal,
        categoryId: categoriaFinal,
    };
}
async function editar_statusServico_service(id, user_id, novoStatus) {
    const servico = await (0, service_wanted_repository_js_1.buscarServicoPorId)(id);
    if (!servico || Number(servico.user_id) !== Number(user_id)) {
        throw new AppError_js_1.default("Serviço não encontrado", 404);
    }
    if (typeof novoStatus !== "boolean") {
        throw new AppError_js_1.default("O campo novoStatus deve ser um valor booleano (true ou false)", 400);
    }
    await (0, service_wanted_repository_js_1.editar_statusServico_repository)(id, novoStatus);
    return { id: Number(id), ativo: novoStatus };
}
async function buscarServicoPorId_service(id) {
    if (!id) {
        throw new AppError_js_1.default("Serviço não existente");
    }
    const servico = await (0, service_wanted_repository_js_1.buscarServicoPorId)(id);
    return servico;
}
async function listarCategorias_service() {
    if (categoriasCache) {
        return categoriasCache;
    }
    const lista_categorias = await (0, service_wanted_repository_js_1.listar_Categorias_repository)();
    categoriasCache = lista_categorias;
    return categoriasCache;
}
