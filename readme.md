# yt-api_SQL

## API do projeto yt-api_SQL

Essa é uma versão inicial que foi criada com um banco SQL, a versão final foi refatorada para rodar com NoSQL utilizando o MongoDB.

Confira a versão final da API no seguinte link: https://github.com/andre-ribeiro93/yt-api_mongoDB


## 📦 Tecnologias utilizadas

  - Node.js

  - Express

  - MariaDB + MySQL Workbench

  - dotenv

  - cors

  - bcrypt

  - jsonwebtoken


## ⚙️ Requisitos

Antes de começar, certifique-se de ter os seguintes recursos instalados em sua máquina:

  - Node.js

  - MariaDB + MySQL Workbench

  - npm


## 🚀 Instalação

1. Clone o repositório:

  git clone https://github.com/andre-ribeiro93/yt-api_SQL.git
  cd yt-api

2. Instale as dependências:

  npm install

3. Configure o arquivo .env:

Crie um arquivo .env na raiz do projeto com as variáveis conforme arquivo:
.env.exemple


## ▶️ Executando a API

  npm run dev

O servidor será iniciado em: http://localhost:3306


## 🔐 Autenticação

A API utiliza JWT (JSON Web Token) para autenticação. Após o login, um token é gerado e deve ser enviado nas requisições protegidas através do header:

Authorization: Bearer <seu_token>


## 📡 Exemplos de Rotas
Usuário

  - POST /api/user/sign-up – Cadastro de novo usuário

  - POST /api/user/sign-in – Login do usuário e geração de token

  - GET /api/user/get-user – Retorna os dados do usuário autenticado

Vídeos

  - POST /api/videos/create-video – Upload/criação de novo vídeo (protegida)

  - GET /api/videos/get-videos – Lista os vídeos do usuário autenticado (protegida)

  - GET /api/videos/search – Busca vídeos públicos por palavra-chave (não autenticada)

  - DELETE /api/videos/delete-video/:video_id – Deleta um vídeo específico (protegida)


## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.
