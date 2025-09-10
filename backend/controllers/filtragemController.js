import { leituraChamadosFiltrados, leituraTecnicoPool } from "../models/filtragemChamados.js";

const getChamadosArea = async (req, res) => {
  try {
    const usuario = req.usuario.id;
    const areaTecnicoCompleta = await leituraTecnicoPool(usuario);
    const areaTecnico = areaTecnicoCompleta[0].id_pool;
    
    const { page = 1, status, prioridade, data } = req.query;

    const { rows, totalItems, totalPages } = await leituraChamadosFiltrados({
      page: Number(page),
      status,
      tipo: areaTecnico,
      prioridade,
      data,
    });

    const paginaFinal = Math.max(1, Math.min(Number(page), totalPages));

    return res.json({
      data: rows,
      pagination: { currentPage: paginaFinal, totalPages, totalItems, pageSize: 5 },
    });
  } catch (error) {
    console.error("Erro no controller de chamados:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};




export { getChamadosArea };
