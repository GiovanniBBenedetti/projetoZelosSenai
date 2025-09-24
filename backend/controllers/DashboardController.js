import { listarPatrimoniosDashboard, listarTodosUsuariosDashboard, listarChamadosAtrasados, listarGraficoGrauPrioridade, listarGraficoTipoChamado, listarChamadosParams } from "../models/Dashboard.js"
import { readAll, executeRawQuery } from '../config/database.js';

const listarPatrimonioDashboardController = async (req, res) => {
    try {
        const { status } = req.query
        let patrimonios;
        if (status) {
            patrimonios = await listarPatrimoniosDashboard(status)
        } else {
            patrimonios = await listarPatrimoniosDashboard()
        }
        res.status(200).json(patrimonios)
    } catch (err) {
        console.error('Erro ao listar Patrimônios: ', err)
        res.status(500).json({ mensagem: 'Erro ao listar Patrimônios' })
    }
}



const listarUsuariosDashboardController = async (req, res) => {
    try {
        const { status } = req.query;

        let usuarios;
        if (status) {
            usuarios = await listarTodosUsuariosDashboard(status);
        } else {
            usuarios = await listarTodosUsuariosDashboard();
        }

        res.status(200).json(usuarios)
    } catch (err) {
        console.error('Erro ao listar usuarios: ', err)
        res.status(500).json({ mensagem: 'Erro ao listar usuarios' })
    }
}



const listarChamadosAtrasadosController = async (req, res) => {
    try {
        const chamados = await listarChamadosAtrasados();
        res.status(200).json(chamados);
    } catch (err) {
        console.error("Erro ao listar chamados atrasados:", err);
        res.status(500).json({ mensagem: "Erro ao listar chamados atrasados" });
    }
};


const listarGraficoGrauPrioridadeController = async (req, res) => {
    try {
        const { grauPrioridade } = req.query;

        const chamados = await listarGraficoGrauPrioridade(grauPrioridade);



        res.status(200).json(chamados);
    } catch (err) {
        console.error(`Erro ao listar chamados por grau prioridade: `, err);
        res.status(500).json({ mensagem: 'Erro ao listar chamados por grau prioridade' });
    }
};



const listarGraficoTipoController = async (req, res) => {
    try {
        const { tipo } = req.query;

        const chamados = await listarGraficoTipoChamado(tipo);


        res.status(200).json(chamados);
    } catch (err) {
        console.error(`Erro ao listar chamados por tipo: `, err);
        res.status(500).json({ mensagem: 'Erro ao listar chamados por tipo' });
    }
};

const getTecnicosDestaque = async (req, res) => {
    try {
        const query = `
            SELECT
                u.id,
                u.nome,
                u.email,
                u.descricao,
                u.foto,
                COUNT(c.id) AS chamados_resolvidos
            FROM
                usuarios u
            JOIN
                chamados c ON u.id = c.tecnico_id
            WHERE
                c.status = 'concluído'
            GROUP BY
                u.id, u.nome, u.email, u.descricao
            ORDER BY
                chamados_resolvidos DESC
            LIMIT 3;
        `;
        const tecnicos = await executeRawQuery(query);
        res.status(200).json(tecnicos);
    } catch (error) {
        console.error('Erro ao buscar técnicos em destaque:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}


const listarchamadosParamsController = async (req, res) => {
    try {
        const { status } = req.query;

        let chamados
        if (status) {
            chamados = await listarChamadosParams(status);
        } else {
            chamados = await listarChamadosParams()
        }




        res.status(200).json(chamados);
    } catch (err) {
        console.error(`Erro ao listar chamados por status: `, err);
        res.status(500).json({ mensagem: 'Erro ao listar chamados por status' });
    }
};



const getChamadosPorSemana = async (req, res) => {
    try {
        const sql = `
       SELECT 
    DAYNAME(criado_em) as dia,
    status,
    COUNT(*) as total
FROM chamados
WHERE criado_em >= CURDATE() - INTERVAL 6 DAY
GROUP BY dia, status
ORDER BY FIELD(
    dia,
    'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'
);

        `;

        const rows = await executeRawQuery(sql);

        const mapaDias = {
            Monday: "Segunda",
            Tuesday: "Terça",
            Wednesday: "Quarta",
            Thursday: "Quinta",
            Friday: "Sexta",
            Saturday: "Sábado",
            Sunday: "Domingo"
        };

        const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

        const result = {
            labels: diasSemana,
            datasets: {
                enviados: [],
                andamento: [],
                concluidos: [],

            }
        };

        diasSemana.forEach(dia => {
            const enviados = rows.find(r => mapaDias[r.dia] === dia && r.status === "enviado");
            const andamento = rows.find(r => mapaDias[r.dia] === dia && r.status === "em andamento");
            const concluidos = rows.find(r => mapaDias[r.dia] === dia && r.status === "concluído");

            result.datasets.enviados.push(enviados ? enviados.total : 0);
            result.datasets.andamento.push(andamento ? andamento.total : 0);
            result.datasets.concluidos.push(concluidos ? concluidos.total : 0);

        });

        res.json(result);
    } catch (error) {
        console.error("Erro ao buscar chamados:", error);
        res.status(500).json({ error: "Erro ao buscar chamados" });
    }
};



export {
    listarPatrimonioDashboardController, getTecnicosDestaque, listarUsuariosDashboardController, listarChamadosAtrasadosController, listarGraficoGrauPrioridadeController, listarGraficoTipoController, listarchamadosParamsController, getChamadosPorSemana
};