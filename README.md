# Caveo Backend Test

Este projeto é uma API REST desenvolvida com Node.js, TypeScript, PostgreSQL e AWS Cognito para autenticação.

## Pré-requisitos

- Node.js (versão 14 ou superior)
- Docker Desktop
- Git

## Instalação

1. Clone o repositório:
cd caveo-backend

2. Instale as dependências:
npm install

3. Inicie o container Docker com PostgreSQL:
docker-compose up -d

4. Inicie a aplicação:
npm run dev


A aplicação estará disponível em `http://localhost:3000`

## Documentação da API

A documentação Swagger está disponível em `http://localhost:3000/api-docs`

## Fluxo de Uso

1. **Criar novo usuário**
   - Endpoint: POST `/auth`
   - Body:
{
"email": "seu-email@exemplo.com",
"password": "sua-senha"
}

- Resposta: Mensagem de confirmação de registro

2. **Confirmar usuário no Cognito**
- Endpoint: POST `/confirm-user`
- Use o endpoint para confirmar o usuario no cognito

3. **Login**
- Endpoint: POST `/auth`
- Use as mesmas credenciais do registro
- A resposta incluirá um token JWT

4. **Usar outros endpoints**
- Adicione o token no header Authorization:
Authorization: Bearer token-jwt

## Endpoints Disponíveis

### Públicos
- `POST /auth` - Login/Registro de usuário
- `POST /confirm-user` - Confirmaçao de usuário no Cognito

### Protegidos (requer token)
- `GET /me` - Informações do usuário atual
- `PUT /edit-account` - Atualizar informações do usuário
- `GET /users` - Listar todos os usuários (apenas admin)

