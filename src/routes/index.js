import express from 'express';
import flightsRouter from './flights.js';

const router = express.Router();
router.use(flightsRouter);

export default router;