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



export { listarPatrimoniosDashboard, listarTodosUsuariosDashboard, listarChamadosAtrasados}