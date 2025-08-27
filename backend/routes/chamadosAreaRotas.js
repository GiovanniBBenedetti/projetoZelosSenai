import express from 'express';
import {
    lerChamadoController
} from '../controllers/chamadosAreaController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
const router = express.Router();

router.get('/', authMiddleware, lerChamadoController);

router.options('/', (req, res) => {
    res.setHeader('Allow', 'GET');
    res.status(204).send();
});

export default router;
