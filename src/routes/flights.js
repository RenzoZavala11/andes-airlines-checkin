import express from 'express';
import { CheckinService } from '../services/checkinService.js';

const router = express.Router();

// Redirige la ruta raíz "/" a "/flights/1/passengers"
router.get('/', (req, res) => {
  res.redirect('/flights/1/passengers');
});

/**
 * Endpoint para obtener pasajeros de un vuelo con check-in automático
 * Aplica algoritmo de asignación de asientos priorizando menores y grupos familiares 
 * ordenados por tamaño de grupo descendente.
 */
router.get('/flights/:id/passengers', async (req, res) => {
  const id = req.params.id;

  try {
    const checkinService = new CheckinService();
    const data = await checkinService.performAutomaticCheckin(id);
    if (!data) {
      return res.status(404).json({
        code: 404,
        data: {},
      });
    }
    return res.json({
      code: 200,
      data
    });
  } catch (err) {
    console.error("Error en check-in:", err);
    return res.status(400).json({
      code: 400,
      errors: 'could not connect to db',
    });
  }
});

export default router;