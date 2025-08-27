import {read, readAll} from '../config/database.js';

const listarPools = async () => {
  try {
    return await readAll('pools');
  } catch (error) {
    console.error('Erro ao listar pools:', error);
    throw error;
  }
}

const listarPoolsporId = async (poolId) => {
  try {
    return await read('pools', poolId);
  } catch (error) {
    console.error('Erro ao listar pool por ID:', error);
    throw error;
  }
}

export {listarPools, listarPoolsporId};