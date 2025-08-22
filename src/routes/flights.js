import express from 'express';
import { CheckinService } from '../services/checkinService.js';

const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Redirecciona a la lista de pasajeros del vuelo 1
 *     description: Redirige automáticamente a /flights/1/passengers
 *     responses:
 *       302:
 *         description: Redirección a /flights/1/passengers
 */
router.get('/', (req, res) => {
  res.redirect('/flights/1/passengers');
});

/**
 * @swagger
 * /flights/{id}/passengers:
 *   get:
 *     summary: Obtiene los pasajeros de un vuelo con check-in automático
 *     description: Aplica algoritmo de asignación de asientos priorizando menores y grupos familiares ordenados por tamaño de grupo descendente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del vuelo
 *     responses:
 *       200:
 *         description: Lista de pasajeros con asientos asignados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: Vuelo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 404
 *                 data:
 *                   type: object
 *       400:
 *         description: Error de conexión con la base de datos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 errors:
 *                   type: string
 *                   example: could not connect to db
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