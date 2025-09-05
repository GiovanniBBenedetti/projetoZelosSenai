import {
  criarChamado,
  leituraChamados,
  chamadosVirgens,
  atribuicaoChamadosVirgens,
  leituraDeTodosChamados,
  obterChamadoStatus,
  atualizarChamados,
  atualizarStatus,
  obterChamadoUsuario
} from '../models/Chamado.js';
import { fileURLToPath } from 'url';
import path from 'path'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const criarChamadoController = async (req, res) => {
  if (!req.usuario.id) {
    return res.status(401).json({ mensagem: 'Usuário não autenticado' });
  }

  try {
    const { titulo, descricao, patrimonio, prioridade, tipo } = req.body;
    const usuario = req.usuario.id;



    const chamadosExistentes = await leituraChamados(patrimonio, tipo);

    if (chamadosExistentes.length > 0) {
      return res.status(409).json({
        mensagem:
          'Não foi possível criar seu chamado, pois já existe um registro para este mesmo patrimônio e tipo solicitado em aberto.',
      });
    }

    let arquivos = null;
    if (req.files && req.files.length > 0) {
      arquivos = req.files
        .map(file => file.path.replace(__dirname.replace("\\controllers", ""), ""))
        .join(",");
    }

    const chamadoData = {
      titulo: titulo,
      descricao: descricao,
      patrimonio: patrimonio,
      grau_prioridade: prioridade,
      tipo_id: tipo,
      usuario_id: usuario,
    };

    const chamadoId = await criarChamado(chamadoData);
    res.status(201).json({
      mensagem:
        'Seu chamado foi registrado, aguarde que jajá um tecníco responsavél ja vai resolver',
      chamadoId,
    });
  } catch (error) {
    console.error('Erro ao criar chamado:', error);
    res.status(500).json({ mensagem: 'Erro ao criar chamado' });
  }
};

const listarChamadosVirgensController = async (req, res) => {
  try {
    const { status } = req.query;

    let chamados;
    if (status) {
      chamados = await chamadosVirgens(status);
    } else {
      chamados = await chamadosVirgens();
    }


    res.status(200).json(chamados);
  } catch (err) {
    console.error(`Erro ao listar chamados: `, err);
    res.status(500).json({ mensagem: 'Erro ao listar chamados' });
  }
};


const atribuirChamadoController = async (req, res) => {

  if (!req.usuario.id) {
    return res.status(401).json({ mensagem: 'Usuário não autenticado' });
  }
  try {
    const chamadoId = req.params.id;
    const tecnico = req.usuario.id;



    const tecnicoDesignado = {
      tecnico_id: tecnico,
      status: 'em andamento'
    };

    await atribuicaoChamadosVirgens(chamadoId, tecnicoDesignado);
    res.status(200).json({ mensagem: 'Chamado atribuído com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar chamado:', error);
    res.status(500).json({ mensagem: 'Erro ao atualizar chamado' });
  }
};


const atualizarStatusController = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const statusPermitidos = ["enviado", "em andamento", "concluído"];
  const statusLower = status?.toLowerCase();

  if (!statusPermitidos.includes(statusLower)) {
    return res.status(400).json({ mensagem: "Status inválido" });
  }

  const idNum = parseInt(id);
  if (isNaN(idNum)) {
    return res.status(400).json({ mensagem: "ID inválido" });
  }

  try {
    const atualizado = await atualizarStatus(idNum, { status: statusLower });
    res.status(200).json(atualizado);
  } catch (err) {
    console.error("Erro ao atualizar chamado:", err);
    res.status(500).json({ mensagem: "Erro ao atualizar chamado", atualizado });
  }
};



const listarTodosChamadosController = async (req, res) => {
  try {
    const chamados = await leituraDeTodosChamados();
    res.status(200).json(chamados);
  } catch (err) {
    console.error(`Erro ao listar todos os chamados: `, err);
    res.status(500).json({ mensagem: 'Erro ao listar chamados' });
  }
};

const obterChamadoUsuarioController = async (req, res) => {
  if (!req.usuario.id) {
    return res.status(401).json({ mensagem: 'Usuário não autenticado' });
  }
  try {
    const { funcao } = req.query;
    const id = req.usuario.id;

    let chamados;
    if (funcao === 'tecnico') {
      chamados = await obterChamadoUsuario(id, funcao);
    } else {
      chamados = await obterChamadoUsuario(id, funcao);
    }

    const ultimos = chamados.slice(-3)

    res.status(200).json(ultimos);
  } catch (err) {
    console.error(`Erro ao listar chamados: `, err);
    res.status(500).json({ mensagem: 'Erro ao listar chamados' });
  }
};

const atualizarChamadoController = async (req, res) => {
  if (!req.usuario?.id) {
    return res.status(401).json({ mensagem: 'Usuário não autenticado' });
  }

  try {
    const id = req.params.id;
    const {
      TITULO,
      DESCRICAO,
      TIPO_ID,
      TECNICO_ID,
    } = req.body;

    console.log(TIPO_ID)

    const chamadoData = {
      titulo: TITULO,
      descricao: DESCRICAO,
      tipo_id: parseInt(TIPO_ID),
      tecnico_id: parseInt(TECNICO_ID)
    };

    await atualizarChamados(id, chamadoData);

    res.status(200).json({ mensagem: 'Chamado atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar chamado:', error);
    res.status(500).json({ mensagem: 'Erro ao atualizar chamado' });
  }
};

export {
  criarChamadoController,
  listarChamadosVirgensController,
  atribuirChamadoController,
  listarTodosChamadosController,
  atualizarStatusController,
  obterChamadoUsuarioController,
  atualizarChamadoController
};
