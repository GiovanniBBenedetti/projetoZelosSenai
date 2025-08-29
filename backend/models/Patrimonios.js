import { read, readAll, create, deleteRecord, update } from "../config/database.js";

const listarPatrimonios = async () => {
    try {
        return await readAll('equipamentos')
    } catch (err) {
        console.error('Erro ao listar Patrimônios: ', err)
        throw err
    }
};

const obterPatrimonioPorId = async (id) => {
    try {
        return await read('equipamentos', `PATRIMONIO = ${id}`)
    } catch (err) {
        console.error('Erro ao obter Patrimônio por ID: ', err)
        throw err;
    }
}

const criarPatrimonio = async (patrimonioData) => {
    try {
        return await create('equipamentos', patrimonioData);
    } catch (error) {
        console.error('Erro ao criar Patrimônio:', error);
        throw error;
    }
};


    const atualizarStatusPatrimonio = async (id, equipamentoData) => {
    try {
    await update('equipamentos', equipamentoData, `PATRIMONIO = ${id}`);
    } catch (error) {
    console.error('Erro ao atualizar patrimônio:', error);
    throw error;
    }
}


    const excluirPatrimonio  = async (id) => {
        try {
        await deleteRecord('equipamentos', `id = ${id}`);
        } catch (error) {
        console.error('Erro ao excluir Patrimônios:', error);
        throw error;
        }
    };
export {listarPatrimonios, obterPatrimonioPorId, criarPatrimonio,excluirPatrimonio, atualizarStatusPatrimonio}