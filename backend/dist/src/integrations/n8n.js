"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificar_proposta_recebida = notificar_proposta_recebida;
async function notificar_proposta_recebida(dados) {
    const webhookUrl = process.env.N8N_PROPOSTA_WEBHOOK_URL;
    if (!webhookUrl) {
        throw new Error("URL do webhook n8n não configurada.");
    }
    const resposta = await fetch(webhookUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-ServiMatch-webhook-secret": process.env.N8N_WEBHOOK_SECRET
        },
        body: JSON.stringify(dados),
        signal: AbortSignal.timeout(10000),
    });
    if (!resposta.ok) {
        throw new Error(`Falha ao enviar notificação para o n8n: HTTP ${resposta.status}`);
    }
    console.log("Resposta do n8n:", resposta.status);
    return true;
}
