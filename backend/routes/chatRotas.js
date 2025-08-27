import express from 'express';
import {
  listarMensagensController,
  criarMensagensController,
} from '../controllers/ChatController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, criarMensagensController);
router.get('/', listarMensagensController);

export default router;
