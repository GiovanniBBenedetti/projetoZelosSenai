import { readAll } from '../config/database.js';

const leituraTecnicoPool = async (idTecnico) => {
    try {
        return await readAll(
            'pool_tecnico',
            `id_tecnico = ${idTecnico}`
        );
    } catch (error) {
        console.error('Erro ao obter consultas:', error);
        throw error;
    }
}

const leituraChamados = async (area) => {
    try {
        return await readAll(
            'chamados',
            `tipo_id = ${area} AND tecnico_id IS NULL`
        );
    } catch (error) {
        console.error('Erro ao obter consultas:', error);
        throw error;
    }
};


export {
    leituraChamados, leituraTecnicoPool
};