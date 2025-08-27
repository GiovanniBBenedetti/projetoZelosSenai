import { listarMensagens, criarMensagens } from '../models/Chat.js';

const listarMensagensController = async (req, res) => {
  const id = req.headers.chamado_id;
  try {
    const mensagens = await listarMensagens(id);
    res.status(200).json(mensagens);
  } catch (err) {
    console.error('Erro ao listar mensagens', err);
    res.status(500).json({ mensagem: 'Erro ao listar mensagens' });
  }
};

const criarMensagensController = async (req, res) => {
  if (!req.usuario.id) {
    return res.status(401).json({ mensagem: 'Usuário não autenticado' });
  }

  try {
    const { chamadoId, novoApontamento, usuario, tecnico, admin } = req.body;
    const pessoaMensagem = req.usuario.id;

    const chatData = {
      chamado_id: chamadoId,
      descricao: novoApontamento,
    };

    if (usuario) {
      chatData.usuario_id = pessoaMensagem;
    } else if (tecnico) {
      chatData.tecnico_id = pessoaMensagem;
    } else if (admin) {
      chatData.admin_id = pessoaMensagem;
    }

    const chatId = await criarMensagens(chatData);
    res.status(201).json({ mensagem: 'Chat criado com sucesso', chatId });
  } catch (error) {
    console.error('Erro ao criar chat:', error);
    res.status(500).json({ mensagem: 'Erro ao criar chat' });
  }
};

export { listarMensagensController, criarMensagensController };
