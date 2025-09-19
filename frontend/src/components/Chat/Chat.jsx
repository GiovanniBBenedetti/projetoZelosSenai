'use client';

import { useState, useEffect } from 'react';
import React from 'react';
import './chat.css';
import { getCookie } from 'cookies-next';

export default function Chat({ idChamado, possuiTecnico, isConcluido }) {
  const [mensagens, setMensagens] = useState([]);
  const [carregandoMensagens, setCarregandoMensagens] = useState(true);
  const [novoApontamento, setNovoApontamento] = useState('');
  const [funcao, setFuncao] = useState('');
  const [textoInput, setTextoInput] = useState('')

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
      setMensagens([]);
    } finally {
      setCarregandoMensagens(false);
    }
  }

  useEffect(() => {
    setCarregandoMensagens(true);
    carregarMensagens();

    const funcaoCookie = getCookie('funcao');
    setFuncao(funcaoCookie);

    console.log(funcao)
    if (funcao === 'tecnico') {
      setTextoInput('Resgate o chamado primeiro, ou o chamado já foi concluído')
    }
  }, []);

  if (carregandoMensagens) {
    return <p>Carregando mensagens...</p>;
  }

  async function mensagem() {
    const token = getCookie('token');

    if (novoApontamento == '' || !novoApontamento.trim()) {
      return;
    }

    const dados = JSON.stringify({
      chamadoId: idChamado,
      novoApontamento,
      usuario: funcao === 'usuario' || funcao === 'admin',
      tecnico: funcao === 'tecnico',
    });

    try {
      const response = await fetch('http://localhost:8080/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: dados,
      });

      if (response.ok) {
        await carregarMensagens();
        setNovoApontamento('');
      } else {
        alert('errado');
      }
    } catch (error) {
      alert('Erro ao enviar os dados.');
    }
  }
  console.log(isConcluido)
  return (
    <>
      <style>
        {`
      .message-box.left {
        background-color: var(--cinza);
        font-size: 13px;
        border-radius: 0px 10px 10px 10px;
        align-self: flex-start;
        text-align: left;
        color: #fff;
        min-width: 38vh;
      }

      .message-box.right {
      background-color: var(--vermelhoMedio);
      font-size: 13px;
      border-radius: 10px 0px 10px 10px;
      align-self: flex-end;
      text-align: right;
      color: var(--branco);
      min-width: 38vh;
      }`}
      </style>
      <div className="">
        <div className="card-container">
          <div className="card-body">
            <div className="messages-container">
              {mensagens.map((mensagem, chave) => {
                const souMensagem =
                  ((funcao === 'usuario' || funcao === 'admin') && mensagem.usuario_id) ||
                  (funcao === 'tecnico' && !mensagem.usuario_id);
                return (
                  <div
                    key={chave}
                    className={`message-box ${souMensagem ? 'right' : 'left'}`}
                  >
                    <p className="titulo-msg">
                      {souMensagem
                        ? 'Você'
                        : funcao === 'tecnico'
                          ? 'Solicitante'
                          : 'Técnico'}
                    </p>
                    <p>{mensagem.descricao}</p>
                    <div className="d-flex justify-content-between">
                      <p
                        className={`message-box ${mensagem.usuario_id ? 'hora-chat2' : 'hora-chat'}`}
                      >
                        {new Date(mensagem.criado_em).toLocaleTimeString(
                          'pt-BR',
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                          }
                        )}
                      </p>
                      <p
                        className={`message-box ${mensagem.usuario_id ? 'data-chat' : 'data-chat2'}`}
                      >
                        {new Date(mensagem.criado_em).toLocaleDateString(
                          'pt-BR'
                        )}
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
        {possuiTecnico === true && isConcluido === false ? (
          <>
            <input
              type="text"
              className="form-control input-nova-chat w-100"
              placeholder="Digite sua mensagem..."
              value={novoApontamento}
              onChange={(e) => setNovoApontamento(e.target.value)}
              required
            />
          </>
        ) : (
          <>
            <input
              type="text"
              className="form-control input-nova-chat w-100"
              placeholder={textoInput || "Digite sua mensagem..."}
              value={novoApontamento}
              onChange={(e) => setNovoApontamento(e.target.value)}
              required
              readOnly
            />
          </>
        )}

        <button className="btn-modal-chat" onClick={mensagem}>
          <i className="bi bi-arrow-right"></i>
        </button>
      </div>
    </>
  );
}