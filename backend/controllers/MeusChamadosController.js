import {
    listarMeusChamadosUsuario,
    listarMeusChamadosTecnico,
  } from "../models/MeusChamados.js";
  
  const listarMeusChamadosController = async (req, res) => {
    try {
      if (!req.usuario?.id) {
        return res.status(401).json({ mensagem: "Usuário não autenticado" });
      }
  
      const id = req.usuario.id;
      const status = req.query.status || null;
  

      const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
      const limit = Math.min(
        Math.max(parseInt(req.query.limit, 10) || 10, 1),
        100
      );
      const offset = (page - 1) * limit;
  

      let chamados;
      if (req.usuario.funcao === "tecnico") {
        chamados = await listarMeusChamadosTecnico(id, status, limit, offset);
      } else {
        chamados = await listarMeusChamadosUsuario(id, status, limit, offset);
      }
  
      
      return res.status(200).json({
        data: chamados,
        page,
        limit,
        count: chamados.length,
      });
    } catch (err) {
      console.error("Erro ao listar chamados: ", err);
      return res.status(500).json({ mensagem: "Erro ao listar chamados" });
    }
  };
  
  export { listarMeusChamadosController };
  