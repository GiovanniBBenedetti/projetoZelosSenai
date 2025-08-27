import { listarMeusChamadosUsuario, listarMeusChamadosTecnico } from '../models/MeusChamados.js';

const listarMeusChamadosController = async (req, res) => {
    try {
        if (!req.usuario.id) {
            return res.status(401).json({ mensagem: 'Usuário não autenticado' });
        }

        const tipo = req.query.tipo;
        const id = req.usuario.id;

        console.log(tipo, id)

        let meusChamados

        if (tipo === 'admin' || tipo === 'usuario') {
            meusChamados = await listarMeusChamadosUsuario(id);
        } else if (tipo == 'tecnico') {
            meusChamados = await listarMeusChamadosTecnico(id);
        }
        
        res.status(200).json(meusChamados);
    } catch (err) {
        console.error(`Erro ao listar chamados: `, err);
        res.status(500).json({ mensagem: 'Erro ao listar chamados' });
    }
};

export { listarMeusChamadosController, };
