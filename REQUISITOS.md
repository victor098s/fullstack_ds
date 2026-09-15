# Documento de Requisitos e Funcionalidades - CineVault

Este documento descreve detalhadamente o que o sistema **CineVault (fullstack_ds)** realiza, as regras de negócio, o escopo do projeto, suas limitações (o que ele **não** faz) e a arquitetura técnica adotada.

---

## 📌 Visão Geral do Projeto
O **CineVault** é uma aplicação web fullstack para gerenciamento e navegação em um catálogo de filmes. O sistema possui controle de acesso (usuários e administradores), interface fluida em **Single Page Application (SPA)** construída com React e Vite, e backend Node.js (Express) integrado ao banco de dados relacional **PostgreSQL (`db-filmes`)**.

---

## ✅ O Que o Projeto Faz (Requisitos Funcionais e Recursos)

### 1. Autenticação e Gestão de Usuários
- **Cadastro de Usuário**: Permite a criação de novas contas enviando Nome, E-mail e Senha.
- **Login de Usuário**: Autenticação via e-mail e senha com geração de token seguro **JWT (JSON Web Token)** com expiração de 30 minutos.
- **Diferenciação de Perfis**:
  - **Usuário Comum (`user`)**: Pode visualizar o Dashboard, navegar no Catálogo de filmes e ver detalhes de cada obra.
  - **Administrador (`admin`)**: Possui permissões totais para adicionar novos filmes, editar dados existentes e excluir filmes do catálogo.
- **Gerenciamento de Sessão**: Armazenamento seguro de token no `localStorage` com encerramento automático em caso de expiração ou erro 401/403.

### 2. Gestão do Catálogo de Filmes (CRUD completo)
- **Visualização de Filmes**: Exibe capas estilizadas e organizadas em grade responsiva.
- **Busca por Título**: Barra de pesquisa em tempo real no catálogo.
- **Filtro por Gênero**: Dropdown dinâmico para filtrar filmes por gênero cadastrado.
- **Adicionar Filme (Apenas Admin)**: Formulário exclusivo contendo **estritamente os 6 campos do banco PostgreSQL (`db-filmes`)**:
  1. **Nome do Filme** (`nome` - Texto)
  2. **Duração** (`duracao` - Texto/Minutos)
  3. **Quantidade** (`quantidade` - Número inteiro)
  4. **Ano de Lançamento** (`ano` - Número inteiro)
  5. **Gênero** (`genero` - Texto)
  6. **Nome do Diretor** (`nome_do_diretor` - Texto)
- **Editar Filme (Apenas Admin)**: Atualização de todos os 6 campos de qualquer filme selecionado.
- **Excluir Filme (Apenas Admin)**: Remoção definitiva de um filme com confirmação de segurança.

### 3. Interface e Arquitetura Frontend (SPA)
- **Single Page Application (SPA)**: Navegação instantânea sem recarregar a página no navegador.
- **Componentização Modular**:
  - `Header`: Barra de navegação responsiva.
  - `Toast`: Notificações flutuantes de sucesso e erro.
  - `Poster`: Card visual estilizado para cada obra.
  - `MovieGrid`: Layout em grade reutilizável.
  - Páginas dedicadas (`HomePage`, `LoginPage`, `RegisterPage`, `DashboardPage`, `CatalogPage`, `MovieDetailPage`, `MovieFormPage`).
- **Tratamento de Erros de Conexão**: Feedback claro e intuitivo caso o servidor backend esteja inacessível.

### 4. Integração com Banco de Dados PostgreSQL (`db-filmes`)
- Integração via gatilhos em views PostgreSQL (`vwfilmes`).
- Operações de `INSERT`, `UPDATE` e `DELETE` executadas diretamente sobre a view `vwfilmes` com associação automática em tabelas relacionadas (`filmes`, `classificacao`, `genero`, `genero_filme`, `diretores`, `filme_diretor`).

---

## ❌ O Que o Projeto NÃO Faz (Limitações e Fora do Escopo)

1. **Upload ou Armazenamento de Imagens Externas / Pôsteres**:
   - O projeto **não faz** upload ou armazenamento de arquivos de imagem em disco/cloud, nem salva URLs de imagem no banco de dados. Os cards utilizam capas visuais padronizadas geradas via CSS.
2. **Armazenamento de Sinopses**:
   - O banco de dados PostgreSQL (`db-filmes`) **não possui** coluna de sinopse/descrição longa, portanto o projeto não armazena nem exige texto de sinopse.
3. **Sistema de Marcação "Em Destaque"**:
   - O projeto **não possui** campo no banco de dados para marcar filmes individualmente como "destaque". As seleções exibidas no Dashboard correspondem aos filmes adicionados recentemente ao acervo.
4. **Streaming ou Player de Vídeo**:
   - O sistema é focado na gestão de acervo/estoque de filmes e **não exibe** exibição de vídeos ou trailers.
5. **Avaliação / Reviews de Filmes por Usuários**:
   - Não há sistema de estrelas, comentários ou notas atribuídas por usuários comuns aos filmes.
6. **Recuperação de Senha por E-mail**:
   - O sistema **não envia** e-mails de redefinição de senha (como serviços via SMTP/Nodemailer).

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 19, Vite, Context API, CSS3 (Design responsivo e card styling).
- **Backend**: Node.js, Express 5, JSONWebToken, Bcrypt, PG (Node Postgres client).
- **Banco de Dados**: PostgreSQL (`db-filmes`).

---

## 🚀 Como Executar o Projeto

### 1. Iniciar o Backend
```bash
cd backend
npm install
npm start
```
O backend estará em execução em `http://localhost:3000`.

### 2. Iniciar o Frontend
```bash
cd frontend
npm install
npm run dev
```
Acesse a aplicação em `http://localhost:5173`.
