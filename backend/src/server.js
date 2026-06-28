import dotenv from 'dotenv';
import { app } from './app.js';
import { initModels } from './models/index.js';

dotenv.config();

const port = process.env.PORT || 3001;

initModels()
  .then(() => {
    app.listen(port, () => console.log(`StockForge API rodando na porta ${port}`));
  })
  .catch((error) => {
    console.error('Falha ao conectar ao banco:', error);
    process.exit(1);
  });
