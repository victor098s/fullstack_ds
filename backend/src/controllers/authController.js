const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usuariosModel = require("../models/usuariosModel");

const saltRounds = 12;

function dadosValidos(body) {
  return body && body.Nome && body.Email && body.Senha;
}

function gerarToken(usuario) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET não configurado");
  }

  return jwt.sign(
    { id: usuario.Id_user, email: usuario.Email, role: usuario.Role_user },
    process.env.JWT_SECRET,
    { expiresIn: "1m" },
  );
}

function respostaAutenticacao(res, usuario) {
  return res.status(200).json({
    token: gerarToken(usuario),
    usuario: {
      id: usuario.Id_user,
      nome: usuario.Nome,
      email: usuario.Email,
      role: usuario.Role_user,
    },
  });
}

async function registrar(req, res) {
  if (!dadosValidos(req.body)) {
    return res
      .status(400)
      .json({ error: "Nome, email e senha são obrigatórios" });
  }

  try {
    const email = req.body.Email.trim().toLowerCase();
    const existente = await usuariosModel.buscarPorEmail(email);

    if (existente) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    const senha = await bcrypt.hash(req.body.Senha, saltRounds);
    const usuario = await usuariosModel.criar({
      nome: req.body.Nome.trim(),
      email,
      senha,
      role: "user",
    });

    return res.status(201).json({ usuario });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    if (error.message === "JWT_SECRET não configurado") {
      return res.status(500).json({ error: error.message });
    }

    return res.status(500).json({ error: "Erro ao cadastrar usuário" });
  }
}

async function login(req, res) {
  if (!req.body?.Email || !req.body?.Senha) {
    return res.status(400).json({ error: "Email e senha são obrigatórios" });
  }

  try {
    const email = req.body.Email.trim().toLowerCase();
    const usuario = await usuariosModel.buscarPorEmail(email);
    const senhaValida =
      usuario && (await bcrypt.compare(req.body.Senha, usuario.Senha));

    if (!senhaValida) {
      return res.status(401).json({ error: "Email ou senha inválidos" });
    }

    return respostaAutenticacao(res, usuario);
  } catch (error) {
    if (error.message === "JWT_SECRET não configurado") {
      return res.status(500).json({ error: error.message });
    }

    return res.status(500).json({ error: "Erro ao realizar login" });
  }
}

async function perfil(req, res) {
  try {
    const usuario = await usuariosModel.buscarPorEmail(req.usuario.email);

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    return res.status(200).json({
      id: usuario.Id_user,
      nome: usuario.Nome,
      email: usuario.Email,
      role: usuario.Role_user,
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao consultar perfil" });
  }
}

async function criarAdmin(req, res) {
  if (!dadosValidos(req.body)) {
    return res
      .status(400)
      .json({ error: "Nome, email e senha são obrigatórios" });
  }

  try {
    const email = req.body.Email.trim().toLowerCase();
    const existente = await usuariosModel.buscarPorEmail(email);

    if (existente) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    const senha = await bcrypt.hash(req.body.Senha, saltRounds);
    const usuario = await usuariosModel.criar({
      nome: req.body.Nome.trim(),
      email,
      senha,
      role: "admin",
    });

    return res.status(201).json({ usuario });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    return res.status(500).json({ error: "Erro ao cadastrar administrador" });
  }
}

module.exports = { registrar, login, perfil, criarAdmin };
