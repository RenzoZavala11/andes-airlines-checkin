import express from 'express';
import './models/associations.js';
import routes from './routes/index.js';

const app = express();
app.use(express.json());

// Configurar rutas principales de la API
app.use(routes);


export default app;