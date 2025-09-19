"use client";
import "./cardVirgem.css";
import React, { useEffect, useState } from "react";
import Chat from "../Chat/Chat";
import { getCookie } from "cookies-next";
import BtnPegarChamado from "../BtnPegarChamado/BtnPegarChamado";

export default function Carrosel({ chamados = [] }) {
  const [page, setPage] = useState(1);
  const [userChamadoData, setUserChamadoData] = useState({});
  const [funcao, setFuncao] = useState("");



  function page1() {
    setPage(1);
  }
  function page2() {
    setPage(2);
  }

const opcoesTipos = {
    1: 'Externo',
    2: 'Manutenção',
    3: 'Apoio Técnico',
    4: 'Limpeza'
   };

  useEffect(() => {
    const funcaoCookie = getCookie("funcao");
    if (funcaoCookie) setFuncao(funcaoCookie);

    const fetchUsersData = async () => {
      const token = getCookie('token');
      const usersData = {};

      for (const chamado of chamados) {
        if (!usersData[chamado.usuario_id]) {
          try {
            const res = await fetch(`http://localhost:8080/usuarios/${chamado.usuario_id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
              const data = await res.json();
              usersData[chamado.usuario_id] = data;
            } else {
              console.error(`Erro ao buscar dados do usuário ${chamado.usuario_id}`);
            }
          } catch (err) {
            console.error(err);
          }
        }
      }
      setUserChamadoData(usersData);
    };

    if (chamados.length > 0) {
      fetchUsersData();
    }
  }, [chamados]);


  function capitalizeFirst(str = "") {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  const prioridades = {
    '1': "Intervenção Preventiva",
    '2': "Intervenção Sem Urgência",
    '3': "Intervenção Prioritária",
    '4': "Intervenção Imediata",
  };

  async function atribuirTecnico(idChamado) {
    const cookieJWT = getCookie("token");
    try {
      const response = await fetch(
        `http://localhost:8080/chamado/${idChamado}`,
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + cookieJWT,
          },
        }
      );
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        window.location.reload();
      } else {
        alert("Erro ao atribuir chamado");
      }
    } catch {
      alert("Erro ao enviar dados");
    }
  }

  return (
    <>
      {
        chamados.map((chamado) => {
          
          const usuario = userChamadoData[chamado.usuario_id] || {};
          const photoUrl = usuario.foto ? `http://localhost:8080${usuario.foto}` : null;
          const partesNome = usuario.nome ? usuario.nome.trim().split(' ') : [];
          let iniciais = '';
          if (partesNome.length > 0) {
            const primeiroNome = partesNome[0];
            const ultimoNome = partesNome[partesNome.length - 1];
            iniciais = (primeiroNome?.charAt(0).toUpperCase() || '') + (ultimoNome?.charAt(0).toUpperCase() || '');
          }
          const nomeUsuario = usuario.nome ? usuario.nome.split(' ').map(name => capitalizeFirst(name)).join(' ') : 'Usuário';

          return (
            <div key={chamado.id}>
              <div className={`card mt-2 row card-virgem borderColorPrioridade-${chamado.grau_prioridade}-virgem`}
                type="button"
                data-bs-toggle="modal"
                data-bs-target={`#modal-${chamado.id}`}
              >
                <div className="col-12 col-sm-2 col-md-2 ms-md-2 align-items-center d-flex justify-content-center justify-content-sm-start">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt="Foto do usuário"
                      className="rounded-circle"
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="avatar-card-user">{iniciais}</div>
                  )}
                </div>

                <div className="col-12 col-sm-3 col-md-3 align-items-center justify-content-center justify-content-sm-start d-grid mt-2 mt-sm-0">
                  <div className="titulo-virgem justify-content-start align-items-center d-grid text-center text-sm-start">
                    <h2>{chamado.titulo}</h2>
                    <p className="m-0">Iniciado no dia {new Date(chamado.criado_em).toLocaleDateString("pt-BR")}</p>
                  </div>
                </div>

                <div className="col-12 col-sm-3 col-md-3 align-items-center justify-content-center d-flex mt-2 mt-sm-0">
                  <div className={`prioridade-virgem-${chamado.grau_prioridade} align-items-center justify-content-center d-flex`}>
                    <p className={`m-0 prioridadeP`}>{capitalizeFirst(chamado.status)}</p>
                  </div>
                </div>

                <div className="user-virgem col-12 col-sm-2 col-md-2 align-items-center justify-content-center justify-content-sm-start d-grid mt-2 mt-sm-0">
                  <div className="align-items-center justify-content-center d-grid">
                    <h6 className="m-0 text-center text-sm-start">Usuário</h6>
                    <p className="m-0">{nomeUsuario}</p>
                  </div>
                </div>

                <div className="col-12 col-sm-1 col-md-1 more-virgem align-items-center justify-content-center d-flex mt-2 mt-sm-0">
                  <i className="bi bi-plus fs-1"></i>
                </div>
              </div>

              <div
                className="modal fade"
                id={`modal-${chamado.id}`}
                tabIndex={-1}
                aria-labelledby={`modalLabel-${chamado.id}`}
                aria-hidden="true"
              >
                <div className="modal-dialog  modal-lg modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header gap-4">
                      {page === 1 ? (
                        <>
                          <button onClick={page1} className="btn-ficha-virgem-ativado">
                            <h1 className="modal-title fs-5" >
                              Ficha Técnica
                            </h1>
                          </button>

                          <button onClick={page2}>
                            <h1 className="modal-title fs-5">Chat</h1>
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={page1}>
                            <h1 className="modal-title fs-5" id={`modalLabel-${chamado.id}`}>
                              Ficha Técnica
                            </h1>
                          </button>

                          <button onClick={page2} className="btn-chat-virgem-ativado">
                            <h1 className="modal-title fs-5">Chat</h1>
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      />
                    </div>
                    {/* Fim Modal Header */}

                    {page === 1 ? (
                      <div className="modal-body p-4 ficha-tecnica-user">
                      <div className="row mb-3">
                        <div className="col-6 espacoDireita">
                          <p className="label-user">Título:</p>
                          <p className="valor-user mb-3">{chamado.titulo}</p>
                        </div>
                        <div className="col-6">
                          <p className="label-user">Criação:</p>
                          <p className="valor-user mb-3">
                            {new Date(chamado.criado_em).toLocaleDateString(
                              "pt-BR"
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-6">
                          <p className="label-user">Prioridade:</p>
                          <p className="valor-user mb-3">
                            {prioridades[chamado.grau_prioridade]}
                          </p>
                        </div>
                        <div className="col-6">
                          <p className="label-user">Status:</p>
                          <p className="valor-user">
                            {capitalizeFirst(chamado.status)}
                          </p>
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-6">
                          <p className="label-user">Área:</p>
                          <p className="valor-user">{opcoesTipos[chamado.tipo_id]}</p>
                        </div>
                        <div className="col-6">
                          <p className="label-user">Patrimônio:</p>
                          <p className="valor-user">{chamado.patrimonio}</p>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-12">
                          <p className="label-user">Descrição:</p>
                          <p className="valor-user">{chamado.descricao}</p>
                        </div>
                      </div>

                      <div className="mt-4  BotaoCriarChamado">
                      
                          <button onClick={() => atribuirTecnico(chamado.id)}>
                          <i className="bi bi-ticket-fill"></i>
                            Pegar Chamado
                          </button>
                        </div>

                    </div>
                    ) : (
                      <div className="modal-body">
                        <div className="d-flex aling-items-center gap-3">
                          {photoUrl ? (
                            <img src={photoUrl} alt="Foto do usuário" className="rounded-circle" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                          ) : (
                            <div className="avatar-chat">{iniciais}</div>
                          )}
                          <h4>{nomeUsuario}</h4>
                        </div>
                        <Chat idChamado={chamado.id} possuiTecnico={false} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </>
  );
}