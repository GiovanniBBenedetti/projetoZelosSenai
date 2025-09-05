import { readAll } from "../config/database.js";

const listarMeusChamadosUsuario = async (usuarioId, status) => {
    try {
        if (status) {
            return await readAll(
                'chamados',
                `status = '${status}' AND usuario_id = ${usuarioId}`
            );
        } else {
            return await readAll(
                'chamados',
                `usuario_id = ${usuarioId}`
            );
        }
    } catch (err) {
        console.error('Erro ao listar meus chamados usuário: ', err);
        throw err;
    }
};

const listarMeusChamadosTecnico = async (tecnicoId, status) => {
    try {
        if (status) {
            return await readAll(
                'chamados',
                `status = '${status}' AND tecnico_id = ${tecnicoId}`
            );
        } else {
            return await readAll(
                'chamados',
                `tecnico_id = ${tecnicoId}`
            );
        }
        
    } catch (err) {
        console.error('Erro ao listar meus chamados Técnico: ', err)
        throw err
    }
};






export { listarMeusChamadosUsuario, listarMeusChamadosTecnico }