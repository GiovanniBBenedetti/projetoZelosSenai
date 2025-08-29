import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { listarUsuariosDashboardController, listarPatrimonioDashboardController, listarChamadosAtrasadosController } from '../controllers/DashboardController.js';

const router = express.Router();


router.get('/patrimonios', authMiddleware, listarPatrimonioDashboardController)
router.get('/usuarios',authMiddleware , listarUsuariosDashboardController)
router.get('/atrasados', authMiddleware, listarChamadosAtrasadosController);

router.options('/', (req, res) => {
    res.setHeader('Allow', 'GET, OPTIONS');
    res.status(204).send();
})


export default router;

