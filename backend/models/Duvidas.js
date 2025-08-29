import { read, readAll, create, deleteRecord, update } from "../config/database.js";

const listarDuvidas = async () => {
    try {
        return await readAll('duvidas')
    } catch (err) {
        console.error('Erro ao listar duvidas: ', err)
        throw err
    }
};

const obterDuvidaPorId = async (id) => {
    try {
        return await read('duvidas', `id = ${id}`)
    } catch (err) {
        console.error('Erro ao obter duvida por ID: ', err)
        throw err;
    }
}

const criarDuvida = async (DuvidaData) => {
    try {
        return await create('duvidas', DuvidaData);
    } catch (error) {
        console.error('Erro ao criar duvida:', error);
        throw error;
    }
};


    const excluirDuvida = async (id) => {
        try {
        await deleteRecord('duvidas', `id = ${id}`);
        } catch (error) {
        console.error('Erro ao excluir duvida:', error);
        throw error;
        }
    };




    const atualizarDuvida = async (id, duvidaData) => {
    try {
    await update('duvidas', duvidaData, `id = ${id}`);
    } catch (error) {
    console.error('Erro ao atualizar duvida:', error);
    throw error;
    }
    
};
export { listarDuvidas, obterDuvidaPorId, criarDuvida, excluirDuvida, atualizarDuvida}