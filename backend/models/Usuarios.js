import { read, create, readAll, update } from "../config/database.js";

const obterUsuario = async (numeroRegistro) => {
    try {
        return await read('usuarios', `numeroRegistro = '${numeroRegistro}'`);
    } catch (err) {
        console.error('Erro ao obter usuário por Numero de Registro: ', err);
        throw err;
    }
};

const criarUsuario = async (dados) => {
    try {
        return await create('usuarios', dados)
    } catch (err) {
        console.error('Erro ao criar usuario: ', err)
        throw err
    }
}

const listarTodosUsuarios = async (status = null) => {
    try {
        if (status) {
            return await readAll('usuarios', `status = '${status}'`);
        } else {
            return await readAll('usuarios');
        }
    } catch (err) {
        console.error('Erro ao listar usuarios: ', err)
        throw err
    }
};

const listarUsuarioPorId = async (id) => {
    try {
        return await read('usuarios', `id = ${id}`);
    } catch (error) {
        console.error('Erro ao listar usuário por ID:', error);
        throw error;
    }
}
const atualizarUsuario = async (id, usuarioData) => {
    try {
        await update('usuarios', usuarioData, `id = ${id}`);
    } catch (error) {
        console.error('Erro ao atualizar usuario:', error);
        throw error;
    }
};


export { obterUsuario, criarUsuario, listarTodosUsuarios, listarUsuarioPorId, atualizarUsuario };