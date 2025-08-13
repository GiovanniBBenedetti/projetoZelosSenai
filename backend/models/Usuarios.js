import { read, create } from "../config/database.js";

const obterUsuario = async (numeroRegistro) => {
    try {
        return await read('usuarios', `numeroRegistro = '${numeroRegistro}'`);
    } catch (err) {
        console.error('Erro ao obter usuário por Numero de Registro: ', err);
        throw err;
    }
};

const criarUsuario = async (dados) =>{
    try {
        return await create('usuarios', dados)
    } catch (err) {
        console.error('Erro ao criar usuario: ', err)
        throw err
    }
}



export { obterUsuario, criarUsuario };