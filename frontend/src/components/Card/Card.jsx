'use client';
import './card.css';
import React, { useEffect, useState } from 'react';
import BtnChat from '@/components/BtnChatUser/Btnchat';
import Chat from '@/components/Chat/Chat.jsx';
import { getCookie } from 'cookies-next';

export default function Carrosel({ chamados = [] }) {
  const [chamadoAtivo, setChamadoAtivo] = useState(null);
  const [funcao, setFuncao] = useState('');

  useEffect(() => {
    const funcaoCookie = getCookie('funcao');
    setFuncao(funcaoCookie);
  });

  async function atribuirTecnico(idChamado) {
    const cookieJWT = getCookie('token');
    try {
      const response = await fetch(
        `http://localhost:8080/criarchamado/${idChamado}`,
        {
          method: 'PUT',
          headers: {
            Authorization: 'Bearer ' + cookieJWT,
          },
        }
      );
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        alert('Chamado atribuído com sucesso');
      } else {
        alert('Erro ao atribuir chamado');
      }
    } catch {
      alert('Erro ao enviar dados');
    }
  }

  const nomePerfil = 'Davi Leocadio';
  const partes = nomePerfil.trim().split(' ');
  const iniciais =
    partes[0].charAt(0).toUpperCase() +
    partes[partes.length - 1].charAt(0).toUpperCase();
  const nomeExibido = `${partes[0]} ${partes[partes.length - 1]}`;

  return (
    <div className="container-fluid px-0">
      {chamados.map((item) => {
        const isConcluido = item.status === 'concluído';
        return (
          <div key={item.id}>
            <div
              className={`${
                isConcluido ? 'card-desativado' : 'card'
              } d-flex flex-column align-items-center justify-content-center`}
            >
              <div
                className={`card-prioridade-${item.prioridade} d-flex align-items-center justify-content-center`}
              >
                <p>{item.grau_prioridade}</p>
              </div>

              <main className="d-grid mt-4">
                <div className="card-titulo d-grid align-items-center justify-content-center">
                  <h3>{item.titulo}</h3>
                </div>

                <div className="card-patrimonio d-grid w-100 justify-content-center align-items-center">
                  <p>{item.patrimonio}</p>
                </div>

                <div className="card-data d-grid w-100 justify-content-center align-items-center">
                  <p>
                    <b>Criado em:</b>{' '}
                    {new Date(item.criado_em).toLocaleDateString('pt-BR')}
                  </p>
                </div>

                <div className="status-card d-flex align-items-center justify-content-center">
                  <p>{item.status}</p>
                </div>
              </main>

              <div className="accordion-item d-grid w-100 align-items-center justify-content-center">
                <div className="accordion-header d-grid w-100 align-items-center justify-content-center">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#flush-collapseOne-${item.id}`}
                    aria-expanded="false"
                    aria-controls="flush-collapseOne"
                  >
                    <i className="bi bi-caret-down-fill"></i>
                  </button>
                </div>

                <div
                  id={`flush-collapseOne-${item.id}`}
                  className="accordion-collapse collapse"
                  data-bs-parent="#accordionFlushExample"
                >
                  <div className="card-descricao">
                    <p>
                      <b>Descrição:</b> {item.descricao}
                    </p>
                  </div>

                  {!isConcluido && (
                    <div className="card-atualizacao">
                      <p>
                        <b>Atualizado em:</b>{' '}
                        {new Date(item.atualizado_em).toLocaleDateString(
                          'pt-BR'
                        )}
                      </p>
                    </div>
                  )}

                  <div
                    className={`${
                      isConcluido ? 'chat-desativado' : 'chat'
                    } d-grid align-items-center justify-content-center`}
                  >
                    <div
                      type="button"
                      className={isConcluido ? 'btn-desativado' : 'btn'}
                      data-bs-toggle="modal"
                      data-bs-target={`#modal-${item.id}`}
                      onClick={() => setChamadoAtivo(item.id)}
                    >
                      <BtnChat />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal */}
            <div
              className="modal fade"
              id={`modal-${item.id}`}
              tabIndex={-1}
              aria-hidden="true"
              aria-labelledby={`modalLabel-${item.id}`}
            >
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  {isConcluido ? (
                    <>
                      <h2>Informações do Chamado</h2>
                      <p>{item.titulo}</p>
                      <p>{item.tecnico}</p>
                      <p>{item.descricao}</p>
                      <p>{item.grau_prioridade}</p>
                      {chamadoAtivo === item.id && <Chat idChamado={item.id} />}
                    </>
                  ) : (
                    <>
                      <div className="modal-header">
                        <h2
                          className="modal-title"
                          id={`modalLabel-${item.id}`}
                        >
                          <b>Ficha Técnica:</b>
                        </h2>
                        <div className="modal-inicial d-grid sticky-top bg-white">
                          <div className="d-flex">
                            <div className="img-avatar">
                              <p>{iniciais}</p>
                            </div>
                            <div className="nome-chat">{nomeExibido}</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          onClick={() => setChamadoAtivo(null)}
                        ></button>
                      </div>

                      <div className="modal-body d-flex">
                        <div className="ficha d-grid gap-0 m-0">
                          <p>
                            <b>Título:</b> {item.titulo}
                          </p>
                          <p>
                            <b>Prioridade:</b> {item.grau_prioridade}
                          </p>
                          <p>
                            <b>Criação:</b>{' '}
                            {new Date(item.criado_em).toLocaleDateString(
                              'pt-BR'
                            )}
                          </p>
                          <p>
                            <b>Técnico:</b> {item.tecnico}
                          </p>
                          <p>
                            <b>Patrimônio:</b> {item.patrimonio}
                          </p>
                          <p>
                            <b>Tipo:</b> {item.tipo}
                          </p>
                          <p>
                            <b>Descrição:</b> {item.descricao}
                          </p>
                          {funcao === 'tecnico' ? (
                            <button
                              onClick={() => atribuirTecnico(item.id)}
                              className="btn btn-primary"
                            >
                              Pegar chamado
                            </button>
                          ) : (
                            <></>
                          )}
                        </div>

                        <div className="chat-container">
                          {chamadoAtivo === item.id && (
                            <Chat idChamado={item.id} />
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
