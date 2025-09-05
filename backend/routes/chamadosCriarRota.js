import express from 'express';
import {
  criarChamadoController,
  listarChamadosController,
  atribuirChamadoController,
  listarTodosChamadosController,
  atualizarStatusController
} from '../controllers/ChamadoController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
const router = express.Router();

router.get('/', listarChamadosController);

router.get('/todos', listarTodosChamadosController);

router.put('/status/:id', authMiddleware, atualizarStatusController);

router.post('/', authMiddleware, criarChamadoController);

router.put('/:id', authMiddleware, atribuirChamadoController);

router.options('/', (req, res) => {
  res.setHeader('Allow', 'POST');
  res.status(204).send();
});

router.options('/:id', (req, res) => {
  res.setHeader('Allow', 'PUT');
  res.status(204).send();
});

export default router;
