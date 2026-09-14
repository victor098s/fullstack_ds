const express = require('express');
const authController = require('../controllers/authController');
const { autenticar, exigirAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', autenticar, authController.perfil);
router.post('/admin', autenticar, exigirAdmin, authController.criarAdmin);

module.exports = router;
