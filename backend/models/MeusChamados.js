import { readAll } from "../config/database.js";

const listarMeusChamadosUsuario = async (usuarioId, status, limit, offset) => {
  try {
    let where;
    if (status) {
      where = `status = '${status}' AND usuario_id = ${usuarioId} LIMIT ${limit} OFFSET ${offset}`;
    } else {
      where = `usuario_id = ${usuarioId} LIMIT ${limit} OFFSET ${offset}`;
    }

    return await readAll("chamados", where);
  } catch (err) {
    console.error("Erro ao listar meus chamados usuário: ", err);
    throw err;
  }
};

const listarMeusChamadosTecnico = async (tecnicoId, status, limit, offset) => {
  try {
    let where;
    if (status) {
      where = `status = '${status}' AND tecnico_id = ${tecnicoId} LIMIT ${limit} OFFSET ${offset}`;
    } else {
      where = `tecnico_id = ${tecnicoId} LIMIT ${limit} OFFSET ${offset}`;
    }

    return await readAll("chamados", where);
  } catch (err) {
    console.error("Erro ao listar meus chamados Técnico: ", err);
    throw err;
  }
};

export { listarMeusChamadosUsuario, listarMeusChamadosTecnico };
