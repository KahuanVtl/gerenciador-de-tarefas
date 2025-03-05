# API de Carteiras

Este projeto é uma API desenvolvida com **Node.js** e **Express** para gerenciar carteiras de clientes. A API permite realizar operações como listar carteiras e buscar carteiras por ID, com funcionalidades de paginação e limitação de requisições.

## Tecnologias Usadas

- **Node.js**: Ambiente de execução para JavaScript.
- **Express**: Framework para criação de APIs.
- **PostgreSQL**: Banco de dados relacional utilizado para armazenar os dados.
- **Winston**: Biblioteca para logging.
- **express-rate-limit**: Middleware para limitar o número de requisições em um determinado período de tempo.
- **cors**: Middleware para gerenciar compartilhamento de recursos entre diferentes origens.
- **dotenv**: Para carregar variáveis de ambiente do arquivo `.env`.
- **body-parser**: Middleware para parseamento de corpo das requisições HTTP.
- **morgan**: Middleware para logging de requisições HTTP.
- **nodemon**: Ferramenta para reiniciar automaticamente o servidor durante o desenvolvimento.
- **pg**: Cliente PostgreSQL para Node.js.

## Requisitos

- **Node.js** (v16 ou superior)
- **PostgreSQL** instalado e configurado

## Instalação

Siga as instruções abaixo para configurar o ambiente de desenvolvimento e executar o projeto:

1. Clone o repositório:

   ```bash
   git clone https://github.com/KahuanVtl/gerenciador-de-tarefas.git
   cd gerenciador-de-tarefas
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie um arquivo `.env` na raiz do projeto e configure as variáveis de ambiente. Exemplo:
   ```env
   DB_USER=usuario
   DB_HOST=localhost
   DB_NAME=carteirasdb
   DB_PASSWORD=senha
   DB_PORT=5432
   NODE_ENV='development'
   ```

4. Crie o banco de dados e as tabelas necessárias no PostgreSQL.

## Rodando o Projeto

**Inicie o servidor:**
```bash
npm start
```

Para desenvolvimento, você pode usar `nodemon` para reiniciar o servidor automaticamente:
```bash
npm run offline
```

O servidor estará rodando na porta configurada (padrão é `8080`).

## Endpoints

### 1. **GET /v1/customer-wallets** - Listar carteiras

Este endpoint retorna uma lista de carteiras com paginação.

**Parâmetros:**
- `page` (opcional): Página a ser retornada (padrão: 1).
- `limit` (opcional): Número de resultados por página (padrão: 10).

**Exemplo de Requisição:**
```bash
GET /v1/customer-wallets?limit=10&page=1
HEADERS Authorization: "76bb1ff3699e0af" (chave ficticia)
```

**Resposta:**
```json
{
  "message": "Success",
  "data": [
        {
            "id": "1234",
            "name": "Kahuan Vitelli",
            "parent_id": "6134",
            "birth_date": "2004-07-22T06:00:00.000Z",
            "cellphone": "12345678901",
            "phone": "12345678901",
            "email": "teste@gmail.com",
            "occupation": "Desenvolvedor",
            "state": "AC",
            "created_at": "2025-02-28T21:13:10.778Z"
        },
        {...}
  ]
}
```

### 2. **POST /v1/customer-wallets** - Buscar carteiras por ID

Este endpoint busca as carteiras de um cliente específico pelo ID.
**Corpo da Requisição:**
```json
{
  "id": "123"
}
```

**Exemplo de Requisição:**
```bash
POST /v1/customer-wallets
```

**Resposta:**
```json
{
  "message": "Success",
  "data": {
            "id": "1234",
            "name": "Kahuan Vitelli",
            "parent_id": "6134",
            "birth_date": "2004-07-22T06:00:00.000Z",
            "cellphone": "12345678901",
            "phone": "12345678901",
            "email": "teste@gmail.com",
            "occupation": "Desenvolvedor",
            "state": "AC",
            "created_at": "2025-02-28T21:13:10.778Z"
        }
}
```

### 3. **PUT /v1/customer-wallets** - Insere carteiras no banco

Este endpoint insere as carteiras de um cliente específico no banco de dados.
**Corpo da Requisição:**
```json
{
    "name": "teste",
    "birthDate": "1996-04-22 03:00:00",
    "cellphone": "12345678901",
    "phone": "12345678901",
    "email": "teste@gmail.com",
    "occupation": "Desenvolvedor",
    "state": "RS"
}
```

**Exemplo de Requisição:**
```bash
PUT /v1/customer-wallets
```

**Resposta:**
```json
{
    "message": "Success",
    "data": {
        "id": "641792731",
        "name": "teste",
        "parent_id": null,
        "birth_date": "1996-04-22 03:00:00",
        "cellphone": "12345678901",
        "phone": "12345678901",
        "email": "teste@gmail.com",
        "occupation": "Desenvolvedor",
        "state": "RS",
        "created_at": "2025-03-05T14:10:11.621Z"
    }
}
```

## Rate Limiting

Todas as requisições à API são protegidas por **rate limiting** utilizando o middleware `express-rate-limit`. O limite de requisições é configurado como **100 requisições a cada 55 minutos**. Caso o limite seja atingido, a resposta será:

```json
{
  "message": "Muitas requisições, tente novamente mais tarde."
}
```

## Estrutura de Diretórios

```bash
/api                   # Pasta Agrupadora:
    /controllers        # Controladores de funções
    /data               # Logs e data extra
    /routes             # Rotas para busca
    /utils              # Utils auxiliares
/config                # Arquivos de configuração (banco de dados, logs, etc.)
/node_modules          # NPM Modules para bibliotecas
/.                     # Raiz do projeto
```

## Logs

Os logs são gerenciados utilizando a biblioteca **Winston**. Eles são gravados em arquivos no diretório `/logs` e também podem ser configurados para enviar logs para outros serviços de monitoramento.

As logs de WARN e NORMAL estão agrupadas, as demais de erro ficam em uma separada.

## Contribuições

Contribuições são bem-vindas!

## Observações

- A implementação de paginação foi feita nos endpoints de listagem de carteiras, com controle de número de resultados por página.
- A proteção contra excessos de requisições (**rate limiting**) foi configurada globalmente, sendo aplicada a todas as rotas.
- O controle de acesso é feito com base no cabeçalho `Authorization`, permitindo diferentes comportamentos dependendo do tipo de usuário (**usuário comum** ou **administrador**). No entanto, o projeto não possui um sistema de autenticação completo, e a autorização é feita de forma simplificada, com base no `typeUser`.
