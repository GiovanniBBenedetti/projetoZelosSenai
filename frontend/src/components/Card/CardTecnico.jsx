"use client";
import "./cardTecnico.css";
import React, { useEffect, useState } from "react";
import Chat from "../Chat/Chat";
import ProgressBar from "../progress/progress-bar";
import { getCookie } from "cookies-next/client";

export default function Carrosel({ chamados = [] }) {
  const [funcao, setFuncao] = useState("");
  const [iniciais, setIniciais] = useState("");
  const [nomeExibido, setNomeExibido] = useState("");
  const [photoUrl, setPhotoUrl] = useState(null);
  const [page, setPage] = useState(1);
  const [tipoChamado, setTipoChamado] = useState();
  const [chamadosProgress, setChamadosProgress] = useState(chamados);
  const [tecnicos, setTecnicos] = useState();
  const [userChamadoData, setUserChamadoData] = useState({});



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
    const nome = getCookie("nome");

    if (funcaoCookie) setFuncao(funcaoCookie);

    if (nome) {
      const partes = nome.trim().split(" ");
      const iniciaisCalculadas =
        (partes[0]?.charAt(0).toUpperCase() || "") +
        (partes[partes.length - 1]?.charAt(0).toUpperCase() || "");
      const nomeExibidoCalculado = `${partes[0]?.charAt(0).toUpperCase() +
        partes[0]?.slice(1).toLowerCase()
        } ${partes[partes.length - 1]
          ? partes[partes.length - 1].charAt(0).toUpperCase() +
          partes[partes.length - 1].slice(1).toLowerCase()
          : ""
        }`;
      setIniciais(iniciaisCalculadas);
      setNomeExibido(nomeExibidoCalculado);
    }




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


    const fetchTecnicos = async () => {
      try {
        const token = getCookie("token");


        const ids = [...new Set(chamados.map((c) => c.tecnico_id))];

        const promises = ids.map(async (id) => {
          const res = await fetch(`http://localhost:8080/usuarios/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error("Erro ao buscar técnico");
          const data = await res.json();
          return { id, data };
        });

        const results = await Promise.all(promises);


        const tecnicoMap = results.reduce((acc, { id, data }) => {
          acc[id] = data;
          return acc;
        }, {});

        setTecnicos(tecnicoMap);
      } catch (err) {
        console.error("Erro ao buscar técnicos:", err);
      }
    };

    fetchTecnicos();
 

  }, []);


  function capitalizeFirst(str = "") {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  const prioridades = {
    1: "Intervenção Preventiva",
    2: "Intervenção Sem Urgência",
    3: "Intervenção Prioritária",
    4: "Intervenção Imediata",
  };

  const handleStatusChange = async (id, novoStatusIndex) => {
    const statusLabels = ["enviado", "em andamento", "concluído"];
    const novoStatus = statusLabels[novoStatusIndex];

    console.log(`Atualizando chamado ${id} para status: ${novoStatus}`);
    try {
      const token = getCookie("token");

      const res = await fetch(`http://localhost:8080/chamado/status/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: novoStatus }),
      });

      window.location.reload();

    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  };

  return (
    <>
      {chamadosProgress.map((chamado, index) => {
        const isConcluido = chamado.status === "concluído";
        console.log(isConcluido)
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
          <div key={index}>
            <div
              className={`card mt-2 ${isConcluido ? "card-tecnico-desativado" : "card-tecnico"
                } row borderColorPrioridade-${chamado.grau_prioridade}-tecnico`}
              type="button"
              data-bs-toggle="modal"
              data-bs-target={`#exampleModal-${chamado.id}`}
            >
              <div className="col-12 col-sm-2 col-md-2 ms-md-2 align-items-center d-flex justify-content-center justify-content-sm-start">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Foto do usuário"
                    className="rounded-circle"
                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                  />
                ) : (
                  <div className="avatar-card-tecnico">{iniciais}</div>
                )}
              </div>

              <div className="col-12 col-sm-3 col-md-3 align-items-center justify-content-center justify-content-sm-start d-grid mt-2 mt-sm-0">
                <div className="titulo-tecnico justify-content-start align-items-center d-grid text-center text-sm-start">
                  <h2>{chamado.titulo}</h2>
                  <p className="m-0">
                    Iniciado no dia{" "}
                    {new Date(chamado.criado_em).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>

              <div className="col-12 col-sm-3 col-md-3 align-items-center justify-content-center d-flex mt-2 mt-sm-0">
                <div
                  className={`prioridade-tecnico-${chamado.grau_prioridade} align-items-center justify-content-center d-flex`}
                >
                  <p
                    className={`m-0 prioridadeP`}
                  >
                    {capitalizeFirst(chamado.status)}
                  </p>
                </div>
              </div>

              <div className="tecnico-tecnico col-12 col-sm-2 col-md-2 align-items-center justify-content-center justify-content-sm-start d-grid mt-2 mt-sm-0">
                <div className="align-items-center justify-content-center d-grid">
                  <h6 className="m-0 text-center text-sm-start">Usuário</h6>
                  <p className="m-0">{nomeUsuario}</p>
                </div>
              </div>

              <div className="col-12 col-sm-1 col-md-1 more-tecnico align-items-center justify-content-center d-flex mt-2 mt-sm-0">
                <i className="bi bi-plus fs-1"></i>
              </div>
            </div>




            <div
              className="modal fade"
              id={`exampleModal-${chamado.id}`}
              tabIndex={-1}
              aria-labelledby={`exampleModalLabel-${chamado.id}`}
              aria-hidden="true"
            >
              <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header gap-4">
                    {page === 1 ? (
                      <>
                        <button onClick={page1} className="btn-ficha-tecnico-ativado">
                          <h1 className="modal-title fs-5">Ficha Técnica</h1>
                        </button>

                        <button onClick={page2}>
                          <h1 className="modal-title fs-5">Chat</h1>
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={page1}>
                          <h1 className="modal-title fs-5" id={`exampleModalLabel-${chamado.id}`}>
                            Ficha Técnica
                          </h1>
                        </button>

                        <button onClick={page2} className="btn-chat-tecnico-ativado">
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

                  {page === 1 ? (
                    <div className="modal-body p-4 ficha-tecnica-tecnico">
                      <div className="row mb-3">
                        <div className="col-6 espacoDireita">
                          <p className="label-tecnico">Título:</p>
                          <p className="valor-tecnico mb-3">{chamado.titulo}</p>
                        </div>
                        <div className="col-6">
                          <p className="label-tecnico">Criação:</p>
                          <p className="valor-tecnico mb-3">
                            {new Date(chamado.criado_em).toLocaleDateString(
                              "pt-BR"
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-6">
                          <p className="label-tecnico">Prioridade:</p>
                          <p className="valor-tecnico mb-3">
                            {prioridades[chamado.grau_prioridade]}
                          </p>
                        </div>
                        <div className="col-6">
                          <p className="label-tecnico">Status:</p>
                          <p className="valor-tecnico">
                            {capitalizeFirst(chamado.status)}
                          </p>
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-6">
                          <p className="label-tecnico">Área:</p>
                          <p className="valor-tecnico">{opcoesTipos[chamado.tipo_id]}</p>
                        </div>
                        <div className="col-6">
                          <p className="label-tecnico">Patrimônio:</p>
                          <p className="valor-tecnico">{chamado.patrimonio}</p>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-12">
                          <p className="label-tecnico">Descrição:</p>
                          <p className="valor-tecnico">{chamado.descricao}</p>
                        </div>
                      </div>

                      <div className="row mt-5">
                        <ProgressBar funcao={'técnico'}
                          onChange={(novoIndex) => handleStatusChange(chamado.id, novoIndex)}
                          step={["enviado", "em andamento", "concluído"].indexOf(chamado.status)}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="modal-body">
                      <div className="d-flex align-items-center gap-3">
                        {tecnicos[chamado.tecnico_id]?.foto ? (
                          <img
                            src={photoUrl}
                            alt="Foto do técnico"
                            className="rounded-circle"
                            style={{ width: "50px", height: "50px", objectFit: "cover" }}
                          />
                        ) : (
                          <i className="bi bi-person-circle text-center fs-5"></i>
                        )}
                        <h4>{nomeUsuario}</h4>
                      </div>


                      <Chat
                        idChamado={chamado.id}
                        possuiTecnico={true}
                        isConcluido={isConcluido}
                      />
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
