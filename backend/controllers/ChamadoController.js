import {
  criarChamado,
  leituraChamados,
  chamadosVirgens,
  atribuicaoChamadosVirgens,
} from '../models/Chamado.js';

const criarChamadoController = async (req, res) => {
  if (!req.usuario.id) {
    return res.status(401).json({ mensagem: 'Usuário não autenticado' });
  }

  try {
    const { titulo, descricao, patrimonio, prioridade, tipo } = req.body;
    const usuario = req.usuario.id;

    console.log(usuario)

    const chamadosExistentes = await leituraChamados(patrimonio, tipo);

    if (chamadosExistentes.length > 0) {
      return res.status(409).json({
        mensagem:
          'Não foi possível criar seu chamado, pois já existe um registro para este mesmo patrimônio e tipo solicitado em aberto.',
      });
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

const listarChamadosController = async (req, res) => {
  try {
    const { status } = req.query; 

    let chamados;
    if (status) {
      chamados = await chamadosVirgens(status);
    } else {
      chamados = await chamadosVirgens();
    }

    console.log("Chamados retornados:", chamados);
    res.status(200).json(chamados);
  } catch (err) {
    console.error(`Erro ao listar chamados: `, err);
    res.status(500).json({ mensagem: 'Erro ao listar chamados' });
  }
};


const atribuirChamadoController = async (req, res) => {
  console.log(req.usuario.id)
  if (!req.usuario.id) {
    return res.status(401).json({ mensagem: 'Usuário não autenticado' });
  }
  try {
    const chamadoId = req.params.id;
    const tecnico = req.usuario.id;

    console.log(`${chamadoId} - ${tecnico}`);

    const tecnicoDesignado = {
      tecnico_id: tecnico,
    };

    await atribuicaoChamadosVirgens(chamadoId, tecnicoDesignado);
    res.status(200).json({ mensagem: 'Chamado atribuído com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar chamado:', error);
    res.status(500).json({ mensagem: 'Erro ao atualizar chamado' });
  }
};

export {
  criarChamadoController,
  listarChamadosController,
  atribuirChamadoController,
};
