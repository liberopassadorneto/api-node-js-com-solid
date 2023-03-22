# App

GymPass style app.

## RFs (Requisitos Funcionais)

- [x] Deve ser possível se cadastrar;
- [x] Deve ser possível se autenticar;
- [x] Deve ser possível obter o perfil do usuário logado;
- [x] Deve ser possível obter a quantidade de check-ins do usuário logado;
- [x] Deve ser possível o usuário obter seu histórico de check-ins;
- [x] Deve ser possível o usuário buscar academias próximas (até 10km);
- [x] Deve ser possível o usuário buscar academias pelo nome;
- [x] Deve ser possível o usuário realizar check-in em uma academia;
- [x] Deve ser possível validar o check-in do usuário;
- [x] Deve ser possível cadastrar uma academia;

## RNs (Regras de Negócio)

- [x] O usuário NÃO deve poder se cadastrar com um e-mail já existente;
- [x] O usuário NÃO pode fazer 2 check-ins no mesmo dia;
- [x] O usuário NÃO pode fazer check-in se não estiver perto (<= 100m) da academia;
- [x] O check-in só pode ser validado até 20 minutos após criado;
- [x] O check-in só pode ser validado por administradores;
- [x] A academia só pode ser cadastrada por administradores;

## RNFs (Requisitos Não Funcionais)

- [x] A senha do usuário precisa estar criptografada;
- [x] Os dados da aplicação precisam estar persistidos em um BD PostgresSQL;
- [x] Todas listas de dados precisam ser paginadas com 20 itens por página;
- [x] O usuário deve ser identificado por um JWT (JSON Web Token);

# TDD

- red: erro no teste
- green: codar o mínimo para o teste passar
- refactor: refatorar o código

# JWT: Json Web Token

- Usuário faz login
- Envia email/senha
- Backend cria um token ÚNICO, não-modificável e STATELESS
- Stateless: NÃO armazena o token em nenhuma estrutura de persistência de dados (banco de dados, cache, etc)
- Backend: quando vai criar o token, utiliza uma PALAVRA-CHAVE (string)
- Palavra-chave: é uma string que o backend guarda em um arquivo .env
- Email/senha -> header.payload.signature

- Login => JWT
- JWT => Todas as requisições dali para frente
- Header => Authorization: Bearer JWT

# Test Environment: Vitest

- npm i -D npm-run-all
- run sequentially: run-s
- "pretest:e2e": "run-s cd prisma/vitest-environment-prisma && npm-link",

# CI: Continuous Integration

- Github Actions

# CD: Continuous Delivery/Deployment
