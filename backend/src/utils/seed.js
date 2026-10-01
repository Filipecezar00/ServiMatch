import { pool } from "../config/database";

async function runSeeder(){
    try{
        await pool.query(`DELETE * FROM exchanges`); 
        await pool.query(`DELETE * FROM exchange_proposals`)
        await pool.query(`DELETE * FROM services_offered`)
        await pool.query(`DELETE * FROM services_wanted`)
        await pool.query(`DELETE * FROM users`)

        await pool.query(`INSERT INTO users (nome,email,senha) VALUES('Carlos','carlos@gmail.com','Carlos@22')`)
        await pool.query(`INSERT INTO users (nome,email,senha) VALUES('Ana','ana@gmail.com','Ana@22')`)
        await pool.query(`INSERT INTO categories(nome) VALUES('esporte')`)
        await pool.query(`INSERT INTO categories(nome) VALUES('tecnologia')`)
        await pool.query(`INSERT INTO services_offered (user_id,titulo,descricao,ativo) VALUES(1,'aulas de danca','aulas de zumba online',1)`)
        await pool.query(`INSERT INTO services_offered (user_id,titulo,descricao,ativo) VALUES(2,'aulas de java','aulas de springboot',1)`); 
        await pool.query(`INSERT INTO services_wanted (user_id,titulo,descricao,ativo) VALUES(1,'aulas de java','aulas de springboot',1) `); 
        await pool.query(`INSERT INTO services_wanted (user_id,titulo,descricao,ativo) VALUES (2,'aulas de dança','aulas de zumba online',1)`)
        await pool.query(`INSERT INTO exchange_proposals(proposer_id,receiver_id,offered_service_id,wanted_service_id,status,mensagem) VALUES(1,2,1,2,'accepted','desejo aprender java, tem interesse em trocar ?')`)
        await pool.query(`INSERT INTO exchange (proposal_id,status) VALUES(1,'scheduled')`)

    }catch(error){
        console.log("Erro ao executar seed.js:",error)

    }finally{
        await pool.end()
    }
}