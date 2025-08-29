import { listarTodosUsuarios, listarUsuarioPorId, atualizarUsuario } from "../models/Usuarios.js"
import { fileURLToPath } from 'url';
import path from 'path'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const listarUsuariosController = async (req, res) => {
    try {
        const usuariuos = await listarTodosUsuarios()
        res.status(200).json(usuariuos)
    } catch (err) {
        console.error('Erro ao listar usuarios: ', err)
        res.status(500).json({ mensagem: 'Erro ao listar usuarios' })
    }
}

const listarUsuarioPorIdController = async (req, res) => {
    try {
        const usuario = await listarUsuarioPorId(req.params.id)
        if (usuario) {
            res.json(usuario)
        } else {
            res.status(404).json({ mensagem: `Usuário não encontrado` })
        }
    } catch (err) {
        console.error('Erro ao obter Usuário por ID: ', err)
        res.status(500).json({ mensagem: 'Erro ao obter Usuário por ID' })
    }
}

const listarUsuarioPorIdControllerPerfil = async (req, res) => {
    try {
        const usuario = req.usuario.id
        const encontrarUsuario = await listarUsuarioPorId(usuario)
        if (encontrarUsuario) {
            res.json(encontrarUsuario)
        } else {
            res.status(404).json({ mensagem: `Usuário não encontrado` })
        }
    } catch (err) {
        console.error('Erro ao obter Usuário por ID: ', err)
        res.status(500).json({ mensagem: 'Erro ao obter Usuário por ID' })
    }
}



const atualizarStatusUsuarioController = async (req, res) => {
    try {
        const usuarioId = req.params.id;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ mensagem: "Status é obrigatório" });
        }

        await atualizarUsuario(usuarioId, { status });

        res.status(200).json({ mensagem: "Status do usuário atualizado com sucesso" });
    } catch (error) {
        console.error("Erro ao atualizar status do usuário:", error);
        res.status(500).json({ mensagem: "Erro ao atualizar status do usuário" });
    }
};

const atualizarFotoUsuarioController = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;

        let fotoPath = null;
        if (req.file) {
            
            fotoPath = req.file.path.replace(__dirname.replace('\\controllers', ''), '');
        }

     
        const dadosAtualizacao = {};
        if (fotoPath) dadosAtualizacao.foto = fotoPath; 
      

        if (Object.keys(dadosAtualizacao).length === 0) {
            return res.status(400).json({ mensagem: "Nenhum dado para atualizar" });
        }

        // Função que atualiza o usuário no banco
        await atualizarUsuario(usuarioId, dadosAtualizacao);

        res.status(200).json({ mensagem: "Usuário atualizado com sucesso" });
    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        res.status(500).json({ mensagem: "Erro ao atualizar usuário" });
    }
};




export { listarUsuariosController, listarUsuarioPorIdController, atualizarStatusUsuarioController, listarUsuarioPorIdControllerPerfil, atualizarFotoUsuarioController }