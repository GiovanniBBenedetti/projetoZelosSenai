import express from 'express'
import { listarUsuariosController,listarUsuarioPorIdController } from '../controllers/UsuariosController.js' 
import authMiddleware from '../middlewares/authMiddleware.js'
const router = express.Router()


router.get('/', authMiddleware, listarUsuariosController)

router.get('/:id', listarUsuarioPorIdController)



router.options('/', (req, res) => {
    res.setHeader('Allow', 'GET, OPTIONS');
    res.status(204).send();
})

router.options('/:id', (req, res) => {
    res.setHeader('Allow', 'GET, OPTIONS');
    res.status(204).send();
})



export default router  