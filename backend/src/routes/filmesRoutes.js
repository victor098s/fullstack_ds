const express = require('express');
const filmesController = require('../controllers/filmesController');
const { autenticar, exigirAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', filmesController.listarTodos);
router.get('/buscar', filmesController.listarPorNome);
router.post('/', autenticar, exigirAdmin, filmesController.criarFilme);
router.put('/:id', autenticar, exigirAdmin, filmesController.atualizarFilme);
router.delete('/:id', autenticar, exigirAdmin, filmesController.deletarFilme);

module.exports = router;
