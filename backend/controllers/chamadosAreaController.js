import {
  leituraChamados,
  leituraTecnicoPool
} from '../models/ChamadoArea.js';
import { readAll } from '../config/database.js';

const lerChamadoController = async (req, res) => {
  if (!req.usuario.id) {
    return res.status(401).json({ mensagem: 'Usuário não autenticado' });
  }

  try {
    const usuario = req.usuario.id;
    const areaTecnicoCompleta = await leituraTecnicoPool(usuario);
    const areaTecnico = areaTecnicoCompleta[0].id_pool;

    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;

    const chamadosArea = await leituraChamados(areaTecnico, limit, offset);

    const totalResult = await readAll(
      'chamados',
      `tipo_id = ${areaTecnico} AND tecnico_id IS NULL`
    );
    const total = totalResult.length;
    const totalPages = Math.ceil(total / limit);

    const paginaFinal = Math.max(1, Math.min(page, totalPages));

    res.status(200).json({
      data: chamadosArea,
      pagination: {
        currentPage: paginaFinal,
        totalPages,
        totalItems: total,
        pageSize: limit
      },

    });
  } catch (error) {
    console.error('Erro ao carregar chamados:', error);
    res.status(500).json({ mensagem: 'Erro ao carregar chamados' });
  }
};

export { lerChamadoController };