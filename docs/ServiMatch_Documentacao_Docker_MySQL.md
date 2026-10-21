# ServiMatch --- Implantação da infraestrutura do banco de dados com Docker

## 1. Objetivo

Este documento registra o procedimento utilizado para executar o MySQL
do ServiMatch em um contêiner Docker, permitindo que o backend Node.js
se conecte ao banco de dados sem depender de uma instalação local do
MySQL para essa instância.

A configuração foi feita no Ubuntu, dentro do repositório
`~/ServiMatch`.

## 2. Arquitetura utilizada

O ambiente ficou organizado da seguinte forma:

-   **Aplicação mobile:** React Native com Expo.
-   **Backend:** Node.js, conectado ao MySQL por meio de
    `mysql2/promise`.
-   **Banco de dados:** MySQL 8.4 executado em um contêiner Docker.
-   **Orquestração:** Docker Compose.
-   **Porta no Ubuntu:** `3307`.
-   **Porta dentro do contêiner MySQL:** `3306`.
-   **Banco de dados:** `servi_match`.
-   **Persistência:** volume Docker chamado `servimatch_mysql_data`.
-   **Estrutura inicial do banco:** arquivo
    `backend/database/schema.sql`.

O mapeamento de portas utilizado foi `127.0.0.1:3307` no host para a
porta `3306` do contêiner. Assim, o backend executado no Ubuntu pode se
conectar ao MySQL usando `127.0.0.1:3307`.

> Observação: a porta `3307` foi escolhida para evitar conflito com uma
> possível instância local do MySQL que utiliza a porta padrão `3306`.

## 3. Pré-requisitos

Antes de iniciar, é necessário ter:

-   Ubuntu em funcionamento.
-   Docker instalado e funcionando.
-   Docker Compose disponível pelo comando `docker compose`.
-   Repositório ServiMatch clonado/localizado em `~/ServiMatch`.
-   Arquivo de estrutura do banco em `backend/database/schema.sql`.

Para verificar as ferramentas:

``` bash
docker --version
docker compose version
```

Se o Docker exigir permissões administrativas no ambiente, use `sudo`
nos comandos correspondentes.

## 4. Definir a configuração do Docker Compose

Na raiz do projeto, foi utilizado um arquivo Docker Compose para
declarar o serviço do MySQL, a porta publicada, o volume persistente e a
inicialização do esquema SQL.

A configuração registrada no ambiente utiliza estes elementos:

-   Imagem MySQL da versão 8.4.
-   Contêiner denominado `servimatch-mysql`.
-   Publicação da porta do host `3307` para a porta `3306` do contêiner.
-   Volume nomeado `servimatch_mysql_data`.
-   Arquivo `backend/database/schema.sql` disponibilizado ao contêiner
    para inicializar a estrutura do banco.

O nome exato do arquivo e a sintaxe final devem ser conferidos no
`docker-compose.yml` ou `compose.yaml` que está no repositório. O trecho
abaixo é um **exemplo de referência**, não uma substituição automática
do arquivo existente:

``` yaml
services:
  mysql:
    image: mysql:8.4
    container_name: servimatch-mysql
    ports:
      - "127.0.0.1:3307:3306"
    environment:
      MYSQL_DATABASE: servi_match
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASSWORD}
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
    volumes:
      - servimatch_mysql_data:/var/lib/mysql
      - ./backend/database/schema.sql:/docker-entrypoint-initdb.d/schema.sql:ro
    restart: unless-stopped

volumes:
  servimatch_mysql_data:
```

**Atenção:** antes de copiar qualquer exemplo para o projeto, compare-o
com o arquivo já utilizado. Não substitua a configuração funcional sem
necessidade. Os nomes das variáveis de ambiente devem corresponder ao
arquivo Compose e à configuração local.

## 5. Configurar as variáveis de ambiente do backend

No arquivo `backend/.env`, a configuração de conexão usada pelo backend
inclui:

``` dotenv
DB_HOST=127.0.0.1
DB_NAME=servi_match
DB_PORT=3307
```

Também são necessárias as variáveis de usuário e senha do banco, por
exemplo `DB_USER` e `DB_PASSWORD`, com os valores configurados no
ambiente local.

Não publique o arquivo `.env`, não inclua senhas reais na documentação e
não envie credenciais para o GitHub.

O arquivo de conexão `backend/src/config/database.ts` utiliza essas
variáveis para criar o pool do MySQL com `mysql2/promise`. A
configuração implementada lê as variáveis de ambiente e define a porta
padrão como `3306` quando `DB_PORT` não é informada. Por isso, é
importante manter `DB_PORT=3307` no ambiente atual.

## 6. Iniciar o banco de dados

A partir da raiz do repositório:

``` bash
cd ~/ServiMatch
docker compose up -d
```

O parâmetro `-d` executa os contêineres em segundo plano.

Para verificar o estado dos serviços:

``` bash
docker compose ps
```

Para consultar os registros de inicialização do serviço:

``` bash
docker compose logs mysql
```

Se o serviço no arquivo Compose tiver outro nome, substitua `mysql` pelo
nome real do serviço. O nome do contêiner pode ser `servimatch-mysql`,
mas os comandos do Compose normalmente recebem o nome do serviço
definido em `services`.

## 7. Como o esquema do banco foi criado

O arquivo `backend/database/schema.sql` contém a definição das tabelas e
dos relacionamentos do ServiMatch. Ele é disponibilizado ao contêiner no
caminho de inicialização do MySQL.

A imagem oficial do MySQL executa scripts desse diretório durante a
inicialização de um diretório de dados vazio. Portanto, scripts de
inicialização não são executados novamente automaticamente sempre que o
contêiner é reiniciado ou quando o arquivo SQL é alterado.

O esquema do ServiMatch contempla tabelas como:

-   `users`
-   `categories`
-   `services_offered`
-   `services_wanted`
-   `exchange_proposals`
-   `exchanges`
-   `conversas`
-   `mensagens`
-   `reviews`

As chaves estrangeiras relacionam essas tabelas e garantem a integridade
referencial dos dados.

## 8. Configurar o usuário do banco

Foi utilizado um usuário específico para a aplicação, em vez de depender
do usuário administrativo do MySQL para as operações normais do backend.

As permissões concedidas ao usuário da aplicação no banco `servi_match`
foram:

-   `SELECT`
-   `INSERT`
-   `UPDATE`
-   `DELETE`

Essa limitação é importante: o backend consegue consultar e modificar os
dados necessários, mas não precisa de privilégios administrativos para
executar as operações comuns da aplicação.

Durante a preparação do script de seed, a operação `TRUNCATE` apresentou
erro de permissão. O script foi ajustado para utilizar `DELETE`,
compatível com as permissões concedidas. O seed remove dados das tabelas
e deve ser utilizado apenas em ambiente de desenvolvimento/teste, nunca
em uma base com dados reais que devam ser preservados.

## 9. Conectar e testar o backend

O backend conecta-se ao banco usando o pool criado em
`backend/src/config/database.ts`, com os valores de `DB_HOST`,
`DB_USER`, `DB_PASSWORD`, `DB_NAME` e `DB_PORT`.

Depois de iniciar o banco, execute o backend conforme os scripts
definidos no `package.json`. No projeto, o modo de desenvolvimento é
iniciado com:

``` bash
cd ~/ServiMatch/backend
npm run dev
```

Os testes realizados confirmaram que:

1.  O backend conseguiu estabelecer conexão com o MySQL executado no
    Docker.
2.  O script `seed.js` conseguiu inserir dados de teste depois de ser
    ajustado para utilizar os IDs gerados pelo banco.
3.  O cadastro de usuário funcionou.
4.  O login funcionou.

O `seed.js` usa IDs retornados pelas inserções para relacionar usuários,
categorias, serviços e propostas. Isso evita depender de IDs fixos como
`1` e `2`.

## 10. Persistência dos dados

O volume nomeado `servimatch_mysql_data` armazena os arquivos de dados
do MySQL fora do ciclo de vida do contêiner. Isso permite que os dados
sobrevivam à remoção e recriação do contêiner, desde que o volume não
seja removido.

Para parar e iniciar os serviços sem remover os contêineres ou o volume:

``` bash
cd ~/ServiMatch
docker compose stop
docker compose start
```

Depois, confira:

``` bash
docker compose ps
docker compose logs mysql
```

A persistência deve ser validada consultando novamente as tabelas do
banco após reiniciar o serviço.

**Comando de segurança:** não execute `docker compose down -v` como
procedimento rotineiro. A opção `-v` pode remover os volumes declarados
no Compose e apagar os dados persistidos do MySQL.

## 11. Acessar pelo MySQL Workbench

Para conectar o MySQL Workbench à instância que está no Docker, crie ou
selecione uma conexão com os seguintes parâmetros:

-   **Hostname:** `127.0.0.1`
-   **Port:** `3307`
-   **Username:** o usuário configurado para o ServiMatch
-   **Password:** a senha configurada localmente
-   **Default Schema:** `servi_match` (opcional)

É importante usar a porta `3307`. Uma conexão na porta `3306` pode
apontar para outra instalação local do MySQL, e não para o contêiner do
ServiMatch.

## 12. Problemas encontrados e soluções

### 12.1. Chave estrangeira ao inserir serviços

**Sintoma:** o seed falhava ao inserir dados em `services_offered` por
causa de uma chave estrangeira de `user_id`.

**Causa:** o script utilizava IDs de usuário fixos que não correspondiam
necessariamente aos registros existentes.

**Solução:** capturar o `insertId` retornado pela inserção dos usuários
e utilizar esses IDs ao criar os serviços.

### 12.2. Chave estrangeira ao inserir categorias

**Sintoma:** a inserção dos serviços falhava por causa de `category_id`.

**Causa:** o seed pressupunha IDs fixos para as categorias.

**Solução:** capturar o ID gerado pela inserção das categorias e
utilizá-lo ao inserir os serviços.

### 12.3. Permissão negada ao limpar tabelas

**Sintoma:** o script de seed recebia erro de permissão ao executar
`TRUNCATE`.

**Causa:** o usuário da aplicação não possuía privilégios
administrativos suficientes para essa operação.

**Solução:** substituir `TRUNCATE` por `DELETE`, operação compatível com
as permissões concedidas ao usuário do banco.

### 12.4. Workbench conectado à instância errada

**Sintoma:** o Workbench mostrava dados diferentes dos consultados pelo
backend.

**Causa:** o Workbench e o backend podiam estar acessando instâncias
MySQL diferentes, pois o backend utilizava a porta `3307` e a instalação
local podia utilizar `3306`.

**Solução:** configurar uma conexão do Workbench para `127.0.0.1:3307` e
verificar o schema `servi_match`.

### 12.5. Espaço em disco limitado

A partição do Ubuntu possui espaço limitado. Por isso, é importante
verificar o espaço disponível antes de baixar imagens grandes ou
executar operações de manutenção do Docker.

Comandos de inspeção:

``` bash
df -h
docker system df
```

Não remova volumes ou dados do Docker sem identificar exatamente o que
será apagado. Em particular, não utilize `docker compose down -v` para
uma limpeza comum.

## 13. Checklist final

-   [x] MySQL executando em contêiner Docker.
-   [x] Docker Compose utilizado para gerenciar o serviço.
-   [x] Porta `3307` do host direcionada para a porta `3306` do
    contêiner.
-   [x] Banco `servi_match` e esquema inicial configurados.
-   [x] Backend configurado para acessar o MySQL via variáveis de
    ambiente.
-   [x] Conexão backend--MySQL testada.
-   [x] Script de seed executado com sucesso.
-   [x] Cadastro e login testados com sucesso.
-   [ ] Confirmar, em uma verificação final, que os dados persistem após
    parar e iniciar o serviço.
-   [ ] Revisar se `.env` está ignorado pelo Git e documentar apenas
    nomes de variáveis, nunca valores secretos.
-   [ ] Confirmar no arquivo Compose a configuração final de
    `healthcheck` e política de reinicialização, caso sejam adotadas.

## 14. Comandos úteis

``` bash
# Entrar na raiz do projeto
cd ~/ServiMatch

# Iniciar os serviços
docker compose up -d

# Ver o estado dos serviços
docker compose ps

# Acompanhar os logs do MySQL
docker compose logs -f mysql

# Parar os serviços sem remover o volume
docker compose stop

# Iniciar serviços já criados
docker compose start

# Verificar uso de disco
df -h

# Verificar espaço utilizado pelo Docker
docker system df
```

Se o serviço MySQL no Compose não se chamar `mysql`, ajuste o argumento
dos comandos de log para o nome correto.

## 15. Resultado

A infraestrutura atual permite executar o banco de dados MySQL do
ServiMatch em um contêiner Docker, manter seus dados em um volume
nomeado e conectar o backend por meio da porta `3307` no Ubuntu. A
conexão com o banco, a execução do seed, o cadastro e o login foram
testados com sucesso.

A containerização do backend e os ajustes específicos para implantação
em produção podem ser avaliados na fase final do projeto. A configuração
do banco em Docker já atende ao objetivo de desenvolvimento validado até
aqui, ficando pendente confirmar a persistência após reinicialização e
revisar a documentação final do ambiente.
