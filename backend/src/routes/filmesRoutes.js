const r = require("express").Router(),
  c = require("../controllers/filmesController");

// Leitura é permitida a usuários autenticados; escrita exige papel de administrador.
r.get("/", c.listar);
r.get("/:id", c.buscar);
r.post("/", c.admin, c.criar);
r.put("/:id", c.admin, c.atualizar);
r.delete("/:id", c.admin, c.excluir);
module.exports = r;
