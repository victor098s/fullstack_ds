const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const filmesRoutes = require('./src/routes/filmesRoutes');
const authRoutes = require('./src/routes/authRoutes');
const usuariosRoutes = require('./src/routes/usuariosRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
	res.status(200).json({ status: 'ok' });
});

app.use('/filmes', filmesRoutes);
app.use('/auth', authRoutes);
app.use('/usuarios', usuariosRoutes);

app.use((req, res) => {
	res.status(404).json({ error: 'Rota não encontrada' });
});

app.use((error, req, res, next) => {
	console.error(error);
	res.status(500).json({ error: 'Erro interno do servidor' });
});

if (require.main === module) {
	app.listen(port, () => {
		console.log(`Servidor rodando em http://localhost:${port}`);
	});
}

module.exports = app;
