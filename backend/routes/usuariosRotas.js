import express from 'express'
import { listarUsuariosController,listarUsuarioPorIdController, atualizarStatusUsuarioController, listarUsuarioPorIdControllerPerfil, atualizarFotoUsuarioController } from '../controllers/UsuariosController.js' 
import authMiddleware from '../middlewares/authMiddleware.js'
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: (req, file, cb) => {
    const nomeArquivo = `${Date.now()}-${file.originalname}`;
    cb(null, nomeArquivo);
  }
});
const upload = multer({ storage: storage });


router.get('/', authMiddleware, listarUsuariosController)

router.get('/perfil', authMiddleware, listarUsuarioPorIdControllerPerfil)

router.put('/perfil/foto', authMiddleware, upload.single('foto'), atualizarFotoUsuarioController)

router.get('/:id', listarUsuarioPorIdController)

router.put('/:id',authMiddleware, atualizarStatusUsuarioController)


router.options('/', (req, res) => {
    res.setHeader('Allow', 'GET, OPTIONS');
    res.status(204).send();
})

router.options('/:id', (req, res) => {
    res.setHeader('Allow', 'GET, PUT, OPTIONS');
    res.status(204).send();
})



export default router  