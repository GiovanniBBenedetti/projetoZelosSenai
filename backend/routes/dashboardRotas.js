import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { listarUsuariosDashboardController, listarPatrimonioDashboardController, listarChamadosAtrasadosController,listarGraficoGrauPrioridadeController, listarGraficoTipoController, getTecnicosDestaque, listarchamadosParamsController } from '../controllers/DashboardController.js';


const router = express.Router();


router.get('/patrimonios', authMiddleware, listarPatrimonioDashboardController)
router.get('/usuarios',authMiddleware , listarUsuariosDashboardController)
router.get('/atrasados', authMiddleware, listarChamadosAtrasadosController);
router.get('/grauPrioridade', authMiddleware, listarGraficoGrauPrioridadeController);
router.get('/tipo', authMiddleware, listarGraficoTipoController);
router.get('/tecnicosDestaque', authMiddleware, getTecnicosDestaque);
router.get('/chamadosParams', authMiddleware, listarchamadosParamsController);




router.options('/', (req, res) => {
    res.setHeader('Allow', 'GET, OPTIONS');
    res.status(204).send();
})


export default router;

