import dotenv from 'dotenv';
dotenv.config();
import { connect, db as sequelize } from './db/index.js';
import app from './index.js';


const PORT = process.env.PORT || 3000;


(async () => {
  try {
    await connect();
    await sequelize.sync(); // Sincronizar modelos con la base de datos
    app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));
  } catch (err) {
    console.error('❌ No se pudo iniciar:', err);
    process.exit(1);
  }
})();