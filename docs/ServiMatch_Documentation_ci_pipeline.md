# Implementação de CI com GitHub Actions

### Passo a passo

1. **Preparação do ambiente**
   - Verificar se o projeto possui `package.json` e `package-lock.json`.
   - Confirmar a execução local dos testes automatizados.
   - Validar a compilação TypeScript com `npm run build`.

2. **Criação da estrutura**
   - Criar a pasta `.github` na raiz do repositório.
   - Criar a subpasta `workflows`.
   - Criar o arquivo `ci.yml` dentro de `.github/workflows`.

3. **Configuração dos gatilhos**
   - Configurar a execução automática após `push` na branch `main`.
   - Configurar a execução em Pull Requests direcionadas à branch `main`.

4. **Configuração do ambiente**
   - Definir `ubuntu-latest` como ambiente de execução.
   - Configurar o Node.js 24.
   - Definir o diretório de trabalho como `./backend`.

5. **Configuração das etapas do pipeline**
   - Checkout do repositório utilizando `actions/checkout@v4`.
   - Configuração do Node.js utilizando `actions/setup-node@v4`.
   - Instalação das dependências utilizando `npm ci`.
   - Execução dos testes automatizados com Jest.
   - Compilação do projeto utilizando `npm run build`.

6. **Publicação do workflow**
   - Adicionar o arquivo `ci.yml` ao Git.
   - Criar um commit documentando a implementação.
   - Enviar as alterações para o GitHub com `git push`.

7. **Validação da integração contínua**
   - Acessar a aba Actions do repositório.
   - Verificar a execução do workflow.
   - Confirmar a aprovação dos 14 testes automatizados.
   - Verificar a conclusão da compilação TypeScript.