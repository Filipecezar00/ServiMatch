import "dotenv/config"; 
import {pool} from "../config/database.ts";

const categorias = [
    "esporte",
    "tecnologia"
]; 

async function seedCategorias(){
    try{
        for(const nome of categorias){
            await pool.query(
                `INSERT INTO categories (nome)
                 VALUES (?)
                 ON DUPLICATE KEY UPDATE nome = VALUES(nome)
                `,
                [nome]
            ); 
        }
        console.log("Categorias verificadas com sucesso.")
    }catch(error){
        console.error("Erro ao inserir categorias:",error); 
    }finally{
        await pool.end(); 
    }
}
seedCategorias();