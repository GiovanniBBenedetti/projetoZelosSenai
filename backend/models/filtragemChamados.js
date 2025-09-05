import { readAll } from "../config/database.js";

const leituraChamadosFiltrados = async ({ page = 1, status, tipo, prioridade, data }) => {
  try {
    const limit = 5; // igual ao exemplo de referência
    const offset = (page - 1) * limit;

    // Base WHERE
    let whereClause = ["tecnico_id IS NULL"];

    if (status && status !== "todos") {
      whereClause.push(`status = '${status}'`);
    }
    if (tipo) {
      whereClause.push(`tipo_id = '${tipo}'`);
    }
    if (prioridade) {
      whereClause.push(`grau_prioridade = '${prioridade}'`);
    }
    if (data) {
      whereClause.push(`DATE(criado_em) = '${data}'`);
    }

    const whereSql = whereClause.length > 0 ? whereClause.join(" AND ") : null;

    // Busca todos os chamados com filtros
    const todosChamados = await readAll("chamados", whereSql);

    const totalItems = todosChamados.length;
    const totalPages = Math.ceil(totalItems / limit);

    // Paginação
    const paginados = todosChamados
      .sort((a, b) => b.grau_prioridade - a.grau_prioridade)
      .slice(offset, offset + limit);

    return { rows: paginados, totalItems, totalPages };
  } catch (error) {
    console.error("Erro ao filtrar chamados:", error);
    throw error;
  }
};

export { leituraChamadosFiltrados };
