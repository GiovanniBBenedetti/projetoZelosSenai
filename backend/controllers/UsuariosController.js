import { listarTodosUsuarios } from "../models/Usuarios.js"


const listarUsuariosController = async (req, res) => {
    try {
        const usuariuos = await listarTodosUsuarios()
        res.status(200).json(usuariuos)
    } catch (err) {
        console.error('Erro ao listar usuarios: ', err)
        res.status(500).json({ mensagem: 'Erro ao listar usuarios' })
    }
}



export {listarUsuariosController}