const filmesModels = require('../models/filmesModels');

const camposObrigatorios = [
  'nome',
  'duracao',
  'quantidade',
  'ano',
  'genero',
  'nome_do_diretor',
];

function corpoValido(corpo) {
  if (!corpo) return false;
  return camposObrigatorios.every(
    (campo) => corpo[campo] !== undefined && corpo[campo] !== null && String(corpo[campo]).trim() !== '',
  );
}

function idValido(id) {
  return Number.isInteger(Number(id)) && Number(id) > 0;
}

async function listarTodos(req, res) {
  try {
    const filmes = await filmesModels.listarTodos();
    return res.status(200).json(filmes);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar os filmes' });
  }
}

async function listarPorNome(req, res) {
  const { nome } = req.query;

  if (!nome || !nome.trim()) {
    return res.status(400).json({ error: 'Informe o nome do filme' });
  }

  try {
    const filmes = await filmesModels.listarPorNome(nome.trim());

    if (filmes.length === 0) {
      return res.status(404).json({ error: 'Nenhum filme encontrado' });
    }

    return res.status(200).json(filmes);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar os filmes' });
  }
}

async function criarFilme(req, res) {
  if (!corpoValido(req.body)) {
    return res.status(400).json({ error: 'Todos os campos do filme são obrigatórios' });
  }

  try {
    const filme = await filmesModels.criarFilme(
      req.body.nome,
      req.body.duracao,
      req.body.quantidade,
      req.body.ano,
      req.body.genero,
      req.body.nome_do_diretor,
      req.body.imagem || req.body.posterUrl || req.body.poster_url || null,
    );

    return res.status(201).json(filme);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar o filme' });
  }
}

async function atualizarFilme(req, res) {
  if (!idValido(req.params.id) || !corpoValido(req.body)) {
    return res.status(400).json({ error: 'Id ou dados do filme inválidos' });
  }

  try {
    const filme = await filmesModels.atualizarFilme(
      Number(req.params.id),
      req.body.nome,
      req.body.duracao,
      req.body.quantidade,
      req.body.ano,
      req.body.genero,
      req.body.nome_do_diretor,
      req.body.imagem || req.body.posterUrl || req.body.poster_url || null,
    );

    if (!filme) {
      return res.status(404).json({ error: 'Filme não encontrado' });
    }

    return res.status(200).json(filme);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar o filme' });
  }
}

async function deletarFilme(req, res) {
  if (!idValido(req.params.id)) {
    return res.status(400).json({ error: 'Id do filme inválido' });
  }

  try {
    const filme = await filmesModels.deletarFilme(Number(req.params.id));

    if (!filme) {
      return res.status(404).json({ error: 'Filme não encontrado' });
    }

    return res.status(200).json(filme);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao deletar o filme' });
  }
}

module.exports = {
  listarTodos,
  listarPorNome,
  criarFilme,
  atualizarFilme,
  deletarFilme,
};
