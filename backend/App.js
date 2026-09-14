require("dotenv").config();
// Configuração do servidor Express e dos middlewares de JSON/CORS.
const express = require("express");
const cors = require("cors");
const films = require("./src/routes/filmesRoutes");
const c = require("./src/controllers/filmesController");
const app = express();
app.use(cors());
app.use(express.json());
// Rotas públicas: saúde da API, login, cadastro e consulta de categorias.
app.get("/api/health", (_, res) => res.json({ status: "ok" }));
app.post("/api/auth/login", c.login);
app.post("/api/auth/cadastro", c.cadastro);
app.get("/api/categorias", c.categorias);
// As rotas de filmes exigem um token válido.
app.use("/api/filmes", c.auth, films);
app.use((err, _, res, __) => {
  console.error(err);
  res.status(500).json({ erro: "Erro interno do servidor." });
});
const port = process.env.PORT || 3001;
if (require.main === module)
  app.listen(port, () =>
    console.log(`API CineVault: http://localhost:${port}`),
  );
module.exports = app;
