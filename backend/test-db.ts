import "dotenv/config"; 
import {pool} from "./src/config/database.js"; 

async function testarConexao(){
try{
const [rows] = await pool.query("SELECT 1 AS conectado"); 
console.log(rows); 
}catch(error){
console.error("Erro ao conectar com o MySQL:",error); 
}finally{
await pool.end(); 
}
}
testarConexao();
