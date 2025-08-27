import { create, readAll } from '../config/database.js';

const listarMensagens = async (chamado_id) => {
  try {
    return await readAll('apontamentos', `chamado_id = ${chamado_id}`);
  } catch (error) {
    console.error('Erro ao listar mensagem:', error);
    throw error;
  }
};

const criarMensagens = async (mensagemData) => {
  try {
    return await create('apontamentos', mensagemData);
  } catch (error) {
    console.error('Erro ao criar mensagem:', error);
    throw error;
  }
};

export { criarMensagens, listarMensagens };
