const jwt = require('jsonwebtoken');

function obterToken(req) {
  const cabecalho = req.headers.authorization;
  return cabecalho && cabecalho.startsWith('Bearer ')
    ? cabecalho.slice(7)
    : null;
}

function autenticar(req, res, next) {
  const token = obterToken(req);

  if (!token) {
    return res.status(401).json({ error: 'Token de autenticação não informado' });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ error: 'JWT_SECRET não configurado' });
  }

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token de autenticação inválido ou expirado' });
  }
}

function exigirAdmin(req, res, next) {
  if (req.usuario?.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso permitido apenas para administradores' });
  }

  return next();
}

module.exports = { autenticar, exigirAdmin };
