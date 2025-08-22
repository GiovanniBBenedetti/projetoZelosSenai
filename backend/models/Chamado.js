import { create, readAll, update } from '../config/database.js';

const criarChamado = async (chamadoData) => {
  try {
    return await create('chamados', chamadoData);
  } catch (error) {
    console.error('Erro ao criar chamados:', error);
    throw error;
  }
};

const leituraChamados = async (patrimonio, tipoId) => {
  try {
    return await readAll(
      'chamados',
      `patrimonio = "${patrimonio}" AND tipo_id = ${tipoId} AND status != 'concluído'`
    );
  } catch (error) {
    console.error('Erro ao obter consultas:', error);
    throw error;
  }
};

const chamadosVirgens = async () => {
  try {
    return await readAll('chamados', `tecnico_id IS NULL`);
  } catch (error) {
    console.error('Erro ao obter consultas:', error);
    throw error;
  }
};

const atribuicaoChamadosVirgens = async (id, chamadoData) => {
  try {
    await update('chamados', chamadoData, `id = ${id}`);
  } catch (error) {
    console.error('Erro ao atribuir chamado: ', error);
    throw error;
  }
};

export {
  criarChamado,
  leituraChamados,
  chamadosVirgens,
  atribuicaoChamadosVirgens,
};
