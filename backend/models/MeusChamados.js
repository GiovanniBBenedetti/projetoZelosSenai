import { readAll } from "../config/database.js";

const listarMeusChamadosUsuario = async (usuarioId) => {
    try {
        return await readAll('chamados', `usuario_id = ${usuarioId}`)
    } catch (err) {
        console.error('Erro ao listar meus chamados usuário: ', err)
        throw err
    }
};

const listarMeusChamadosTecnico = async (tecnicoId) => {
    try {
        return await readAll('chamados', `tecnico_id = ${tecnicoId}`)
    } catch (err) {
        console.error('Erro ao listar meus chamados Técnico: ', err)
        throw err
    }
};

export { listarMeusChamadosUsuario, listarMeusChamadosTecnico }