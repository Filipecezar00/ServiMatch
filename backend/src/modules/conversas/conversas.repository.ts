import { ResultSetHeader } from "mysql2";
import { pool } from "../../config/database";

export async function buscaUsuarioId(usuarioId: number, conversa_id: number) {
  const [resposta]:any = await pool.query(
    `
  SELECT * FROM conversas
  WHERE id = ? AND (proposer_id = ? OR receiver_id = ? )
  `,
    [conversa_id,usuarioId,usuarioId],
  );

  return resposta;
}

export async function inserirMensagem(conversa_id:number,usuarioId:number,mensagem:string){
    const [resposta] = await pool.query<ResultSetHeader>(`
        INSERT INTO mensagens (conversa_id,sender_id,mensagem) VALUES (?,?,?)
    `,[conversa_id,usuarioId,mensagem])

    return {
        id:resposta.insertId,
        conversa_id,
        sender_id:usuarioId,
        mensagem,
        lido:false,
        created_at:new Date()
    }
}
