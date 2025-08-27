import express from 'express';
import { listarPoolsController, listarPoolporIdController } from '../controllers/PoolController.js';
const router = express.Router();

// Rota para listar todos os pools
router.get('/', listarPoolsController);
// Rota para listar um pool por ID
router.get('/:id', listarPoolporIdController);
export default router;