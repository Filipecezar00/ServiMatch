import { pool } from "../config/database.js";
import bcrypt from "bcrypt";

async function runSeeder() {
  try {
    await pool.query(`SET FOREIGN_KEY_CHECKS = 0`);

    await pool.query(`TRUNCATE TABLE exchanges`);
    await pool.query(`TRUNCATE TABLE exchange_proposals`);
    await pool.query(`TRUNCATE TABLE services_offered`);
    await pool.query(`TRUNCATE TABLE services_wanted`);
    await pool.query(`TRUNCATE TABLE categories`);
    await pool.query(`TRUNCATE TABLE users`);
    await pool.query(`TRUNCATE TABLE reviews`);

    await pool.query(`SET FOREIGN_KEY_CHECKS = 1`);

    const senhaCarlos = await bcrypt.hash("Carlos@22", 10);
    const senhaAna = await bcrypt.hash("AnaSenha@22", 10);
    await pool.query(
      `INSERT INTO users (nome,email,senha) VALUES(?,?,?),(?,?,?)`,
      [
        "Carlos",
        "carlos@gmail.com",
        senhaCarlos,
        "Ana",
        "ana@gmail.com",
        senhaAna,
      ],
    );
    await pool.query(
      `INSERT INTO categories(nome) VALUES('esporte'),('tecnologia')`,
    );
    await pool.query(
      `INSERT INTO services_offered (user_id,titulo,descricao,ativo) VALUES(1,'aulas de danca','aulas de zumba online',1)`,
    );
    await pool.query(
      `INSERT INTO services_offered (user_id,titulo,descricao,ativo) VALUES(2,'aulas de java','aulas de springboot',1)`,
    );
    await pool.query(
      `INSERT INTO services_wanted (user_id,titulo,descricao,ativo) VALUES(1,'aulas de java','aulas de springboot',1) `,
    );
    await pool.query(
      `INSERT INTO services_wanted (user_id,titulo,descricao,ativo) VALUES (2,'aulas de danca','aulas de zumba online',1)`,
    );
    await pool.query(
      `INSERT INTO exchange_proposals(proposer_id,receiver_id,offered_service_id,wanted_service_id,status,mensagem) VALUES(1,2,1,1,'accepted','desejo aprender java, tem interesse em trocar ?')`,
    );
    await pool.query(
      `INSERT INTO exchanges (proposal_id,status) VALUES(1,'scheduled')`,
    );

    console.log("Seeder executado com Sucesso!");
  } catch (error) {
    console.log("Erro ao executar seed.js:", error);
  } finally {
    await pool.end();
  }
}

runSeeder();
