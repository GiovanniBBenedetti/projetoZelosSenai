'use client';

import { useState, useEffect } from 'react';
import React from 'react';
import './chat.css';
import { getCookie } from 'cookies-next';

export default function Chat({ idChamado }) {
  const [mensagens, setMensagens] = useState([]);
  const [carregandoMensagens, setCarregandoMensagens] = useState(true);
  const [novoApontamento, setNovoApontamento] = useState('');
  const [funcao, setFuncao] = useState('');
  const [meuId, setMeuId] = useState(null);

  const fimDasMensagensRef = (fim) => {
    if (fim) {
      fim.scrollIntoView({ behavior: 'smooth' });
    }
  };

  async function carregarMensagens() {
    try {
      const res = await fetch('http://localhost:8080/chat', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          chamado_id: idChamado,
        },
      });

      if (!res.ok) {
        setCarregandoMensagens(false);
      }

      const data = await res.json();
      setMensagens(data);
    } catch (err) {
      console.error(err);
      setMensagens([]);
    } finally {
      setCarregandoMensagens(false);
    }
  }

  useEffect(() => {
    setCarregandoMensagens(true);
    carregarMensagens();

    const funcaoCookie = getCookie('funcao');
    const idUsuario = parseInt(getCookie('idUsuario'));
    setMeuId(idUsuario);
    setFuncao(funcaoCookie);
  }, []);

  if (carregandoMensagens) {
    return <p>Carregando mensagens...</p>;
  }

  async function enviarMensagem() {
    const token = getCookie('token');

    const dados = JSON.stringify({
      chamadoId: idChamado,
      novoApontamento,
      usuario: funcao === 'usuario',
      tecnico: funcao === 'tecnico',
      admin: funcao === 'admin',
    });

    try {
      const response = await fetch('http://localhost:8080/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: dados,
      });

      const data = await response.json();

      if (response.ok) {
        await carregarMensagens();
        setNovoApontamento('');
      } else {
        console.log(data);
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao enviar os dados.');
    }
  }

  return (
    <>
      <div className="">
        <div className="card-container">
          <div className="card-body">
            <div className="messages-container">
              {mensagens.map((mensagem, chave) => {
                const mensagemDoLogado =
                  (mensagem.usuario_id && mensagem.usuario_id === meuId) ||
                  (mensagem.tecnico_id && mensagem.tecnico_id === meuId) ||
                  (mensagem.admin_id && mensagem.admin_id === meuId);

                return (
                  <div
                    key={chave}
                    className={`message-box ${mensagemDoLogado ? 'right' : 'left'}`}
                  >
                    <p className="titulo-msg">
                      {mensagem.admin_id
                        ? "Administrador"
                        : mensagem.usuario_id
                          ? "Usuário"
                          : "Técnico"}
                    </p>
                    <p>{mensagem.descricao}</p>
                    <div className="d-flex justify-content-between">
                      <p className={`message-box ${mensagemDoLogado ? 'hora-chat2' : 'hora-chat'}`}>
                        {new Date(mensagem.criado_em).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <p className={`message-box ${mensagemDoLogado ? 'data-chat2' : 'data-chat'}`}>
                        {new Date(mensagem.criado_em).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={fimDasMensagensRef} />
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex bottom-0">
        <input
          type="text"
          className="form-control input-nova-chat w-100"
          placeholder="Digite sua mensagem..."
          value={novoApontamento}
          onChange={(e) => setNovoApontamento(e.target.value)}
          required
        />
        <button className="btn btn-modal-chat ms-2" onClick={enviarMensagem}>
          <i className="bi bi-arrow-right"></i>
        </button>
      </div>
    </>
  );
}
