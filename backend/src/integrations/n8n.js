export async function notificar_proposta_recebida(dados){
    const webhookUrl = process.env.N8N_PROPOSTA_WEBHOOK_URL; 
    if(!webhookUrl){
        throw new Error("URL do webhook n8n não configurada.")
    }
    
    const resposta = await fetch(webhookUrl,{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(dados),
        signal:AbortSignal.timeOut(10000)
    });
    if(!resposta.ok){
        throw new Error(`Falha ao enviar notificação para o n8n: HTTP ${resposta.status}`,    
        ); 
    }
    return true; 
}