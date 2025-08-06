import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import { listarDuvidasController, criarDuvidaController, obterDuvidaPorIdController, excluirDuvidaController } from '../controllers/DuvidasController.js'

const router = express.Router()

router.get('/', listarDuvidasController)
router.post('/',authMiddleware, criarDuvidaController)
router.get('/:id', obterDuvidaPorIdController)
router.delete('/:id',authMiddleware, excluirDuvidaController)

router.options('/', (req, res) => {
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    res.status(204).send();
})
router.options('/:id', (req, res) => {
    res.setHeader('Allow', 'GET, DELETE OPTIONS');
    res.status(204).send();
})





export default router  