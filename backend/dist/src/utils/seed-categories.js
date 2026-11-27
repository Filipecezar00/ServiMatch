import "dotenv/config";
import { pool } from "../config/database.ts";
const categorias = [
    "tecnologia",
    "educacao",
    "idiomas",
    "design",
    "marketing",
    "fotografia",
    "musica",
    "esporte",
    "saude e bem-estar",
    "beleza e estetica",
    "culinaria",
    "artesanato",
    "manutencao e reparos",
    "servicos domesticos",
    "consultoria e negocios"
];
async function seedCategorias() {
    try {
        for (const nome of categorias) {
            await pool.query(`INSERT INTO categories (nome)
                 VALUES (?)
                 ON DUPLICATE KEY UPDATE nome = VALUES(nome)`, [nome]);
        }
        console.log(`${categorias.length} categorias verificadas com sucesso.`);
    }
    catch (error) {
        console.error("Erro ao inserir categorias:", error);
        process.exitCode = 1;
    }
    finally {
        await pool.end();
    }
}
seedCategorias();
