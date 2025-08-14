import express from 'express'
import { listarUsuariosController } from '../controllers/UsuariosController.js' 

const router = express.Router()


router.get('/', listarUsuariosController)

router.options('/', (req, res) => {
    res.setHeader('Allow', 'GET, OPTIONS');
    res.status(204).send();
})



export default router  