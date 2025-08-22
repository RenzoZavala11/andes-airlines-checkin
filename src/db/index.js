import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();


const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    dialectModule: mysql2,       // usa el driver mysql2
    logging: process.env.DB_LOGGING === 'true' ? console.log : false,
    timezone: '-05:00',          // America/Lima
    define: {
      underscored: true,         // created_at en lugar de createdAt (opcional)
      timestamps: false,
    },
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
    operatorsAliases: 0
  }
);



export async function connect() {
  await db.authenticate(); // prueba conexión
  console.log('✅ Conexión MySQL OK');
}

export { db };
export default db;