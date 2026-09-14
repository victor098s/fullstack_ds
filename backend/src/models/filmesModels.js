const pool = require("../config/database");

async function listarTodos() {
  const sql = "select * from vwFilmes";

  const result = await pool.query(sql);
  return result.rows;
}

async function listarPorNome(nome) {
  const sql = 'SELECT * FROM vwFilmes WHERE nome ILIKE $1';
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
) {
  const sql = `INSERT INTO vwFilmes (nome, duracao, Quantidade, ano, genero, nome_do_diretor)
VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
  const result = await pool.query(sql, [
    nome,
    duracao,
    quantidade,
    ano,
    genero,
    nome_do_diretor,
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
) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const vinculos = await client.query(
      `SELECT f.classificacao,
              fd.diretor AS id_diretor,
              gf.genero AS id_genero
         FROM filmes f
         LEFT JOIN filme_diretor fd ON fd.filme = f.id_filme
         LEFT JOIN genero_filme gf ON gf.filme = f.id_filme
        WHERE f.id_filme = $1`,
      [id],
    );

    if (vinculos.rowCount === 0) {
      await client.query('ROLLBACK');
      return undefined;
    }

    const filmeAtual = vinculos.rows[0];

    await client.query(
      'UPDATE filmes SET nome = $1, duracao = $2, ano = $3 WHERE id_filme = $4',
      [nome, duracao, ano, id],
    );
    await client.query(
      'UPDATE classificacao SET quantidade = $1 WHERE id_class = $2',
      [quantidade, filmeAtual.classificacao],
    );

    const diretor = await client.query(
      'SELECT id_diretor FROM diretores WHERE lower(nome) = lower($1) LIMIT 1',
      [nome_do_diretor],
    );
    const idDiretor = diretor.rows[0]?.id_diretor || (
      await client.query(
        'INSERT INTO diretores (nome) VALUES ($1) RETURNING id_diretor',
        [nome_do_diretor],
      )
    ).rows[0].id_diretor;
    await client.query(
      'UPDATE filme_diretor SET diretor = $1 WHERE filme = $2',
      [idDiretor, id],
    );

    const generoResult = await client.query(
      'SELECT id_gen FROM genero WHERE lower(nome) = lower($1) LIMIT 1',
      [genero],
    );
    const idGenero = generoResult.rows[0]?.id_gen || (
      await client.query(
        'INSERT INTO genero (nome) VALUES ($1) RETURNING id_gen',
        [genero],
      )
    ).rows[0].id_gen;
    await client.query(
      'UPDATE genero_filme SET genero = $1 WHERE filme = $2',
      [idGenero, id],
    );

    const resultado = await client.query('SELECT * FROM vwFilmes WHERE id_filme = $1', [id]);
    await client.query('COMMIT');
    return resultado.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function deletarFilme(id) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const filmeExistente = await client.query(
      'SELECT * FROM vwFilmes WHERE id_filme = $1',
      [id],
    );

    if (filmeExistente.rowCount === 0) {
      await client.query('ROLLBACK');
      return undefined;
    }

    const filmeAtual = filmeExistente.rows[0];

    await client.query('DELETE FROM genero_filme WHERE filme = $1', [id]);
    await client.query('DELETE FROM filme_diretor WHERE filme = $1', [id]);

    if (filmeAtual.classificacao) {
      await client.query('DELETE FROM classificacao WHERE id_class = $1', [filmeAtual.classificacao]);
    }

    const resultado = await client.query(
      'DELETE FROM filmes WHERE id_filme = $1 RETURNING *',
      [id],
    );

    await client.query('COMMIT');
    return resultado.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  listarTodos,
  listarPorNome,
  criarFilme,
  atualizarFilme,
  deletarFilme,
};