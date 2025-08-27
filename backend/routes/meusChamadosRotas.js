import express from 'express';
import {
    listarMeusChamadosController
} from '../controllers/MeusChamadosController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
const router = express.Router();

router.get('/', authMiddleware, listarMeusChamadosController);

router.options('/', (req, res) => {
    res.setHeader('Allow', 'GET');
    res.status(204).send();
});

export default router;
