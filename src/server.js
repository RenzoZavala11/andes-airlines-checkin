import dotenv from 'dotenv';
dotenv.config();
import { connect, db as sequelize } from './config/db.js';
import app from './index.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';

// Configurar ruta para la documentación Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await connect();
    await sequelize.sync(); // Sincronizar modelos con la base de datos
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error('❌ No se pudo iniciar:', err);
    process.exit(1);
  }
})();