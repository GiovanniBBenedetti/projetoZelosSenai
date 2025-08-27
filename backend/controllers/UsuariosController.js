import { listarTodosUsuarios, listarUsuarioPorId } from "../models/Usuarios.js"


const listarUsuariosController = async (req, res) => {
    try {
        const usuariuos = await listarTodosUsuarios()
        res.status(200).json(usuariuos)
    } catch (err) {
        console.error('Erro ao listar usuarios: ', err)
        res.status(500).json({ mensagem: 'Erro ao listar usuarios' })
    }
}

const listarUsuarioPorIdController = async (req, res) =>{
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




export {listarUsuariosController, listarUsuarioPorIdController}