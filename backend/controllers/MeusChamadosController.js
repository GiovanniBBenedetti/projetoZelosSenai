import { listarMeusChamadosUsuario, listarMeusChamadosTecnico } from '../models/MeusChamados.js';

const listarMeusChamadosController = async (req, res) => {
    try {
        if (!req.usuario.id) {
            return res.status(401).json({ mensagem: 'Usuário não autenticado' });
        }

        const status = req.query.status; 
        const id = req.usuario.id;

        console.log("status:", status, "id:", id);

        
        let meusChamados;
        if (req.usuario.funcao === 'tecnico') {
            meusChamados = await listarMeusChamadosTecnico(id, status);
        } else {
            meusChamados = await listarMeusChamadosUsuario(id, status);
        }

        res.status(200).json(meusChamados);
    } catch (err) {
        console.error(`Erro ao listar chamados: `, err);
        res.status(500).json({ mensagem: 'Erro ao listar chamados' });
    }
};

export { listarMeusChamadosController };
