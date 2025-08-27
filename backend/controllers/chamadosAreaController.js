import {
    leituraChamados,
    leituraTecnicoPool
} from '../models/ChamadoArea.js';

const lerChamadoController = async (req, res) => {
    if (!req.usuario.id) {
        return res.status(401).json({ mensagem: 'Usuário não autenticado' });
    }

    try {
        const usuario = req.usuario.id

        const areaTecnicoCompleta = await leituraTecnicoPool(usuario);

        const areaTecnico = areaTecnicoCompleta[0].id_pool;

        const chamadosArea = await leituraChamados(areaTecnico);

        res.status(201).json(chamadosArea);
    } catch (error) {
        console.error('Erro ao criar chamado:', error);
        res.status(500).json({ mensagem: 'Erro ao criar chamado' });
    }
};

export {
    lerChamadoController,
};
