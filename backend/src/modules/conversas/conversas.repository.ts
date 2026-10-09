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

export async function buscaMensagens(conversa_id:number,limit:number,offset:number){
  const [mensagensPromise,quantidade_mensagem] = await Promise.all([
  pool.query(
  `
  SELECT * FROM mensagens WHERE conversa_id  = ?
  ORDER BY created_at DESC
  LIMIT ? OFFSET ?
  `,[conversa_id,limit,offset],
),
  pool.query(`
    SELECT COUNT(*) AS total
    FROM mensagens WHERE conversa_id = ? 
  `,[conversa_id])
])
  const [mensagens] = mensagensPromise; 
  const [totalRows]:any = quantidade_mensagem
  return {mensagens:mensagens,total:totalRows[0].total}
}