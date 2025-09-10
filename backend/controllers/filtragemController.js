import { leituraChamadosFiltrados } from "../models/filtragemChamados.js";

const getChamadosArea = async (req, res) => {
  try {

    
    const { page = 1, status, tipo, prioridade, data } = req.query;

    const { rows, totalItems, totalPages } = await leituraChamadosFiltrados({
      page: Number(page),
      status,
      tipo,
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
