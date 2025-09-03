import { readAll } from "../config/database.js";

const listarPatrimoniosDashboard = async (status = null) => {
    try {
        if (status) {
            return await readAll('equipamentos', `status = '${status}'`);
        } else {
            return await readAll('equipamentos');
        }
    } catch (err) {
        console.error('Erro ao listar Patrimônios: ', err)
        throw err
    }
};

const listarTodosUsuariosDashboard = async (status = null) => {
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


const listarChamadosAtrasados = async () => {
    return await readAll(
        'chamados',
        `status IN ('em andamento','enviado') AND criado_em < NOW() - INTERVAL 7 DAY`
    );
};

const listarGraficoGrauPrioridade = async (grau) => {
    try {
        let whereClause = ``;


        whereClause = `grau_prioridade = '${grau}'`;


        return await readAll('chamados', whereClause);
    } catch (error) {
        console.error('Erro ao obter chamados por grau de prioridade:', error);
        throw error;
    }
};

const listarGraficoTipoChamado = async (tipo) => {
    try {
        let whereClause = ``;


        whereClause = `tipo_id = '${tipo}'`;


        return await readAll('chamados', whereClause);
    } catch (error) {
        console.error('Erro ao obter chamados por tipo:', error);
        throw error;
    }
};



const listarChamadosParams = async (status = null) => {
    try {
        if (status) {
            return await readAll('chamados', `status = '${status}'`);
        } else {
            return await readAll('chamados');
        }
    } catch (err) {
        console.error('Erro ao listar chamados via params: ', err)
        throw err
    }
};




export { listarPatrimoniosDashboard, listarTodosUsuariosDashboard, listarChamadosAtrasados, listarGraficoGrauPrioridade, listarGraficoTipoChamado, listarChamadosParams }