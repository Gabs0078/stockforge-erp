import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from './routes/index.js';

export const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || true }));
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', app: 'StockForge ERP' }));
app.use('/api', router);

app.use((req, res) => res.status(404).json({ message: 'Rota não encontrada' }));

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({ message: error.message || 'Erro interno do servidor' });
});
