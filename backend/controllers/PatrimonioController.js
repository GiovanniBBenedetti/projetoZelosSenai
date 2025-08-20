import { listarPatrimonios, obterPatrimonioPorId, criarPatrimonio, excluirPatrimonio } from "../models/Patrimonios.js"

const listarPatrimonioController = async (req, res) => {
    try {
        const Patrimonios = await listarPatrimonios()
        res.status(200).json(Patrimonios)
    } catch (err) {
        console.error('Erro ao listar Patrimônios: ', err)
        res.status(500).json({ mensagem: 'Erro ao listar Patrimônios' })
    }
}

const obterPatrimonioPorIdController = async (req, res) => {
    try {
        const Patrimonio = await obterPatrimonioPorId(req.params.id)
        if (Patrimonio) {
            res.json(Patrimonio)
        } else {
            res.status(404).json({ mensagem: `Patrimônio não encontrado` })
        }
    } catch (err) {
        console.error('Erro ao obter Patrimonio por ID: ', err)
        res.status(500).json({ mensagem: 'Erro ao obter Patrimonio por ID' })
    }
}



const criarPatrimonioController = async (req, res) => {
    try {
        const { PATRIMONIO, SALA, EQUIPAMENTO, TIPO, OBSERVACAO, STATUS } = req.body;
        const patrimonioData = {
            PATRIMONIO: PATRIMONIO,
            SALA: SALA,
            EQUIPAMENTO: EQUIPAMENTO,
            AQUISICAO: new Date().toISOString().split('T')[0],
            TIPO: TIPO,
            STATUS:STATUS,
            OBSERVACAO: OBSERVACAO,
        };
        const patrimonioId = await criarPatrimonio(patrimonioData);
        res.status(201).json({ mensagem: 'Patrimônio criado com sucesso', patrimonioId });
    } catch (error) {
        console.error('Erro ao criar patrimônio:', error);
        res.status(500).json({ mensagem: 'Erro ao criar Patrimônio' });
    }
}


const excluirPatrimonioController = async (req, res) => {
    try {
        const patrimonioId = req.params.id;
        await excluirPatrimonio(patrimonioId);
        res.status(200).json({ mensagem: 'Patrimônio excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir Patrimônio:', error);
        res.status(500).json({ mensagem: 'Patrimônio excluído com sucesso' });
    }
};

export {
listarPatrimonioController,obterPatrimonioPorIdController,criarPatrimonioController,excluirPatrimonioController
};