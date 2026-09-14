const pool = require('../config/database');

async function buscarPorEmail(email) {
  const result = await pool.query(
    `SELECT id_user AS "Id_user",
            nome AS "Nome",
            email AS "Email",
            senha AS "Senha",
            role_user AS "Role_user"
       FROM usuarios
      WHERE email = $1`,
    [email],
  );
  return result.rows[0];
}

async function criar({ nome, email, senha, role = 'user' }) {
  const result = await pool.query(
    `INSERT INTO usuarios (nome, email, senha, role_user)
     VALUES ($1, $2, $3, $4)
     RETURNING id_user AS "Id_user",
               nome AS "Nome",
               email AS "Email",
               role_user AS "Role_user"`,
    [nome, email, senha, role],
  );
  return result.rows[0];
}

module.exports = { buscarPorEmail, criar };
