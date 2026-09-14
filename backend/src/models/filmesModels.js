const pool = require("../config/database");

async function listarTodos() {
  const sql = "SELECT * FROM vwFilmes ORDER BY id_filme DESC";
  const result = await pool.query(sql);
  return result.rows;
}

async function listarPorNome(nome) {
  const sql = "SELECT * FROM vwFilmes WHERE nome ILIKE $1 ORDER BY id_filme DESC";
  const result = await pool.query(sql, [`%${nome}%`]);
  return result.rows;
}

async function criarFilme(
  nome,
  duracao,
  quantidade,
  ano,
  genero,
  nome_do_diretor,
  imagem,
) {
  const sql = `INSERT INTO vwFilmes (nome, duracao, quantidade, ano, genero, nome_do_diretor, imagem)
VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
  const result = await pool.query(sql, [
    nome,
    duracao,
    quantidade,
    ano,
    genero,
    nome_do_diretor,
    imagem || null,
  ]);
  return result.rows[0];
}

async function atualizarFilme(
  id,
  nome,
  duracao,
  quantidade,
  ano,
  genero,
  nome_do_diretor,
  imagem,
) {
  const sql = `UPDATE vwFilmes
SET nome = $1, duracao = $2, quantidade = $3, ano = $4, genero = $5, nome_do_diretor = $6, imagem = $7
WHERE id_filme = $8 RETURNING *`;
  const result = await pool.query(sql, [
    nome,
    duracao,
    quantidade,
    ano,
    genero,
    nome_do_diretor,
    imagem || null,
    id,
  ]);
  return result.rows[0];
}

async function deletarFilme(id) {
  const sql = "DELETE FROM vwFilmes WHERE id_filme = $1 RETURNING *";
  const result = await pool.query(sql, [id]);
  return result.rows[0];
}

module.exports = {
  listarTodos,
  listarPorNome,
  criarFilme,
  atualizarFilme,
  deletarFilme,
};