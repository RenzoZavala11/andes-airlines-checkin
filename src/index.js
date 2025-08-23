import express from 'express';
import cors from 'cors';
import './models/associations.js';
import routes from './routes/index.js';

const app = express();

// Configure CORS
app.use(cors({
  origin: '*',
  methods: ['GET'],
}));

app.use(express.json());

// Configurar rutas principales de la API
app.use(routes);


export default app;