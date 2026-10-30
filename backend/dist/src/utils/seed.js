"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_ts_1 = require("../config/database.ts");
const bcrypt_1 = __importDefault(require("bcrypt"));
async function runSeeder() {
    try {
        await database_ts_1.pool.query(`DELETE FROM reviews`);
        await database_ts_1.pool.query(`DELETE FROM mensagens`);
        await database_ts_1.pool.query(`DELETE FROM exchanges`);
        await database_ts_1.pool.query(`DELETE FROM conversas`);
        await database_ts_1.pool.query(`DELETE FROM exchange_proposals`);
        await database_ts_1.pool.query(`DELETE FROM services_wanted`);
        await database_ts_1.pool.query(`DELETE FROM services_offered`);
        await database_ts_1.pool.query(`DELETE FROM categories`);
        await database_ts_1.pool.query(`DELETE FROM users`);
        console.log("Dados anteriores removidos");
        const senhaCarlos = await bcrypt_1.default.hash("Carlos@22", 10);
        const senhaAna = await bcrypt_1.default.hash("AnaSenha@22", 10);
        const [resultadoUsuarios] = await database_ts_1.pool.query(`INSERT INTO users (nome,email,senha) VALUES(?,?,?),(?,?,?)`, [
            "Carlos",
            "carlos@gmail.com",
            senhaCarlos,
            "Ana",
            "ana@gmail.com",
            senhaAna,
        ]);
        const idCarlos = resultadoUsuarios.insertId;
        const idAna = idCarlos + 1;
        console.log("ID do Carlos:", idCarlos);
        console.log("ID da Ana:", idAna);
        const [resultadoCategorias] = await database_ts_1.pool.query(`INSERT INTO categories(nome) VALUES('esporte'),('tecnologia')`);
        const idEsporte = resultadoCategorias.insertId;
        const idTecnologia = idEsporte + 1;
        const [resultadoServicos] = await database_ts_1.pool.query(`INSERT INTO services_offered (user_id,titulo,category_id,descricao,ativo) VALUES(?,?,?,?,?),(?,?,?,?,?)`, [idCarlos, "aulas de danca", idEsporte, "aulas de zumba online", 1, idAna, "aulas de java", idTecnologia, "aulas de springboot", 1]);
        const idServicoCarlos = resultadoServicos.insertId;
        const idServicoAna = idServicoCarlos + 1;
        await database_ts_1.pool.query(`INSERT INTO services_wanted (user_id,titulo,category_id,descricao,ativo) VALUES(?,?,?,?,?),(?,?,?,?,?) `, [idCarlos, "aulas de java", idTecnologia, "aulas de springboot", 1, idAna, "aulas de danca", idEsporte, "aulas de zumba online", 1,]);
        const [resultadoProposta] = await database_ts_1.pool.query(`INSERT INTO exchange_proposals(proposer_id,receiver_id,offered_service_id,wanted_service_id,status,mensagem) VALUES(?,?,?,?,?,?)`, [idCarlos, idAna, idServicoCarlos, idServicoAna, "accepted", "Desejo aprender java, tem interesse em trocar?",]);
        const idProposta = resultadoProposta.insertId;
        await database_ts_1.pool.query(`INSERT INTO exchanges (proposal_id,status) VALUES(?,?)`, [idProposta, "scheduled"]);
        console.log("Seeder executado com Sucesso!");
    }
    catch (error) {
        console.log("Erro ao executar seed.js:", error);
    }
    finally {
        await database_ts_1.pool.end();
    }
}
runSeeder();
