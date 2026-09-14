const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

pool.connect((erro, client, release) => {
  if (erro) {
    console.log("❌ Erro ao conectar com o PostgreSQL:", erro);
  } else {
    console.log("✅ Conectado com sucesso ao PostgreSQL");
    release();
  }
});

module.exports = pool;
