# CineVault

Aplicação Full Stack para catálogo e gerenciamento de filmes, com autenticação, perfis usuário/admin, CRUD de filmes e categorias.

## Executar

1. Em `backend`: `npm install` e `npm start`.
2. Em `frontend`: `npm install` e `npm run dev`.

Use `admin@cinevault.com` e senha `123456` para testar a área administrativa. O banco PostgreSQL está modelado em `database/schema.sql`; nesta versão demonstrativa a API inicia com dados em memória.

## API

`POST /api/auth/cadastro`, `POST /api/auth/login`, `GET /api/categorias`, `GET /api/filmes`, `GET /api/filmes/:id`, `POST/PUT/DELETE /api/filmes` (admin).
