import express from 'express';
import { criarPatrimonioController, listarPatrimonioController, excluirPatrimonioController, obterPatrimonioPorIdController } from '../controllers/PatrimonioController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
const router = express.Router();


router.post('/', authMiddleware, criarPatrimonioController);
router.delete('/:id', authMiddleware, excluirPatrimonioController);

router.get('/',authMiddleware, listarPatrimonioController)
router.get('/:id',authMiddleware, obterPatrimonioPorIdController)


router.options('/', (req, res) => {
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    res.status(204).send();
})
router.options('/:id', (req, res) => {
    res.setHeader('Allow', 'GET, DELETE, OPTIONS');
    res.status(204).send();
})


export default router