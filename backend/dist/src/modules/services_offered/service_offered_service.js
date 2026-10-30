"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.criar_service = criar_service;
exports.listarServicosAtivos_service = listarServicosAtivos_service;
exports.listarServicosUsuario_service = listarServicosUsuario_service;
exports.editarServico_service = editarServico_service;
exports.listarCategorias_service = listarCategorias_service;
exports.alterarStatusServico_service = alterarStatusServico_service;
exports.buscarServicoPorId_service = buscarServicoPorId_service;
exports.buscarDetalhesServico = buscarDetalhesServico;
exports.filtro_listar_servicos_offered_service = filtro_listar_servicos_offered_service;
const AppError_js_1 = __importDefault(require("../../utils/AppError.js"));
const service_offered_repository_js_1 = require("./service_offered_repository.js");
const upload_service_js_1 = require("../../utils/upload.service.js");
let categoriasCache = null;
async function criar_service(userId, titulo, descricao, categoryId, imagens = []) {
    if (!titulo || !descricao) {
        throw new AppError_js_1.default("Campos obrigatórios ausentes", 400);
    }
    if (titulo.trim().length < 3 || titulo.trim().length > 200) {
        throw new AppError_js_1.default("titulo deve ter entre 3 e 200 caracteres", 400);
    }
    if (descricao.trim().length < 10 || descricao.trim().length > 1000) {
        throw new AppError_js_1.default("descrição deve ter entre 10 e 1000 caracteres", 400);
    }
    if (!Array.isArray(imagens) || imagens.length > 3) {
        throw new AppError_js_1.default("O serviço pode ter no máximo 3 imagens", 400);
    }
    if (!categoryId) {
        categoryId = null;
    }
    else {
        const categoria_Existente = await (0, service_offered_repository_js_1.buscarCategoriaPorId)(categoryId);
        if (!categoria_Existente) {
            throw new AppError_js_1.default("Categoria não encontrada", 404);
        }
    }
    let imagemUrls = [];
    for (const imagemBuffer of imagens) {
        const resultadoUpload = await (0, upload_service_js_1.enviarImagemCloudinary)(imagemBuffer);
        imagemUrls.push(resultadoUpload.imageUrl);
    }
    const dados_solicitacao = await (0, service_offered_repository_js_1.salvar)(userId, titulo, descricao, categoryId, imagemUrls);
    return dados_solicitacao;
}
async function listarServicosAtivos_service() {
    let servicos = await (0, service_offered_repository_js_1.buscarTodosAtivos)();
    return servicos;
}
async function listarServicosUsuario_service(userId) {
    let servicos_usuario = await (0, service_offered_repository_js_1.buscarMeusServicos)(userId);
    return servicos_usuario;
}
async function editarServico_service(id, userId, titulo, descricao, categoryId) {
    const servico = await (0, service_offered_repository_js_1.buscarServicoPorId)(id);
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
        const categoriaExiste = await (0, service_offered_repository_js_1.buscarCategoriaPorId)(categoryId);
        if (!categoriaExiste) {
            throw new AppError_js_1.default("Categoria informada não existe", 400);
        }
    }
    await (0, service_offered_repository_js_1.atualizar)(id, tituloFinal, descricaoFinal, categoriaFinal);
    return {
        id: Number(id),
        titulo: tituloFinal,
        descricao: descricaoFinal,
        categoryId: categoriaFinal,
    };
}
async function listarCategorias_service() {
    if (categoriasCache) {
        return categoriasCache;
    }
    const lista_categorias = await (0, service_offered_repository_js_1.listarCategorias_repository)();
    categoriasCache = lista_categorias;
    return categoriasCache;
}
async function alterarStatusServico_service(id, userId, novoStatus) {
    const servico = await (0, service_offered_repository_js_1.buscarServicoPorId)(id);
    if (!servico || Number(servico.user_id) !== Number(userId)) {
        throw new AppError_js_1.default("Serviço não encontrado", 404);
    }
    if (typeof novoStatus !== "boolean") {
        throw new AppError_js_1.default("O campo novoStatus deve ser um valor booleano (true ou false)", 400);
    }
    await (0, service_offered_repository_js_1.alterarStatusServico)(id, novoStatus);
    return { id: Number(id), ativo: novoStatus };
}
async function buscarServicoPorId_service(id) {
    if (!id) {
        throw new AppError_js_1.default("Serviço não encontrado", 404);
    }
    const servico = await (0, service_offered_repository_js_1.buscarServicoPorId)(id);
    if (!servico) {
        throw new AppError_js_1.default("Serviço não encontrado", 404);
    }
    return servico;
}
async function buscarDetalhesServico(id) {
    if (!id) {
        throw new AppError_js_1.default("Serviço não encontrado");
    }
    const detalhesServico = await (0, service_offered_repository_js_1.buscaDetalhesServico)(id);
    return detalhesServico;
}
async function filtro_listar_servicos_offered_service(busca, categoryId) {
    let numero_categoryId = null;
    if (busca && busca.trim().length >= 2) {
        busca = busca.trim();
    }
    else {
        busca = null;
    }
    if (categoryId) {
        let conversao = Number(categoryId);
        if (!isNaN(conversao)) {
            numero_categoryId = conversao;
        }
    }
    else {
        numero_categoryId = null;
    }
    let string_busca = busca;
    return await (0, service_offered_repository_js_1.filtro_listar_servicos_offered_repository)(string_busca, numero_categoryId);
}
