import { listarDuvidas, obterDuvidaPorId, criarDuvida, excluirDuvida} from '../models/Duvidas.js';


const listarDuvidasController = async (req, res) => {
    try {
        const duvidas = await listarDuvidas()
        res.status(200).json(duvidas)
    } catch (err) {
        console.error('Erro ao listar Duvídas: ', err)
        res.status(500).json({ mensagem: 'Erro ao listar Duvídas' })
    }
}

const obterDuvidaPorIdController = async (req, res) => {
    try {
        const livro = await obterDuvidaPorId(req.params.id)
        if (livro) {
            res.json(livro)
        } else {
            res.status(404).json({ mensagem: `Duvída não encontrado` })
        }
    } catch (err) {
        console.error('Erro ao obter duvída por ID: ', err)
        res.status(500).json({ mensagem: 'Erro ao obter Duvída por ID' })
    }
}



const criarDuvidaController = async (req, res) => {
    try {
        const { titulo, descricao} = req.body;
        const autor =  req.usuarioNome
        const duvidaData = {
            titulo: titulo,
            descricao: descricao,
            autor: autor,
        };
        const duvidaId = await criarDuvida(duvidaData);
        res.status(201).json({ mensagem: 'Duvida criado com sucesso', duvidaId });
    } catch (error) {
        console.error('Erro ao criar Duvida:', error);
        res.status(500).json({ mensagem: 'Erro ao criar duvida' });
    }
}


const excluirDuvidaController = async (req, res) => {
    try {
        const duvidaId = req.params.id;
        await excluirDuvida (duvidaId);
        res.status(200).json({ mensagem: 'Duvida excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir duvída:', error);
        res.status(500).json({ mensagem: 'Duvída excluído com sucesso' });
    }
};

export {
    listarDuvidasController, obterDuvidaPorIdController,
    criarDuvidaController,  excluirDuvidaController
};