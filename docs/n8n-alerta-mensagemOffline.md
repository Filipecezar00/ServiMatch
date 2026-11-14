## DOCUMENTAÇÃO WORKFLOW 6 N8N SERVIMATCH

## OBJETIVO
Desenvolver uma automação capaz de notificar por e-mail os usuários do ServiMatch que recebem novas mensagens enquanto estão offline.

A solução busca complementar o sistema de comunicação em tempo real, permitindo que usuários ausentes sejam informados sobre novas mensagens recebidas.

## VISÃO GERAL
A automação utiliza a integração entre o backend do ServiMatch e o n8n.
Tecnologias envolvidas:
Node.js e TypeScript: processamento das mensagens e controle de presença.
Socket.IO: comunicação em tempo real.
Axios: comunicação HTTP entre o backend e o n8n
n8n: orquestração da automação.
MySQL: armazenamento e consulta dos dados.
SMTP: envio das notificações por e-mail.

# Nó 1 webhook:
recebe a requisição HTTP enviada pelo backend

# Nó 2 editfield:
organiza os identificadores recebidos.

# Nó 3 mysql:
consulta as tabelas de mensagens, conversas e usuários para localizar o destinatário.

# Nó 4 if:
verifica se o destinatário foi encontrado.

# Nó 5 Send Email:
envia a notificação ao endereço recuperado dinamicamente do banco de dados.

# Nó 6 Edit Field:
organiza os dados da ocorrência quando a consulta não retorna um destinatário válido.


## Principais desafios técnicos:
Controle de presença dos usuários

Foi necessário implementar um mecanismo para identificar quais usuários estavam conectados ao Socket.IO. Para isso, foi utilizado um Map associado a Sets de conexões, permitindo controlar inclusive múltiplas conexões de um mesmo usuário.

Identificação dinâmica do destinatário

Foi necessário desenvolver uma lógica para identificar corretamente o destinatário da mensagem com base nos participantes da conversa, evitando depender de identificadores fixos.

Integração entre backend e n8n

A comunicação entre os sistemas foi implementada utilizando Axios e Webhook HTTP POST, permitindo que o backend acionasse a automação conforme o estado de presença do destinatário.

Consulta e validação dos dados no MySQL

Foi necessário relacionar as tabelas mensagens, conversas e users para recuperar os dados corretos do destinatário. Também foi implementada uma condição IF para tratar situações em que nenhum usuário fosse encontrado.

Tratamento de falhas

Foi necessário separar o tratamento de erros da integração com o n8n do processamento principal da mensagem, evitando que uma falha na automação comprometesse a comunicação entre os usuários.

Configuração do ambiente de produção

Foi necessário compreender a diferença entre as URLs de teste e produção do Webhook, além da necessidade de hospedar o n8n em um ambiente acessível pelo backend.