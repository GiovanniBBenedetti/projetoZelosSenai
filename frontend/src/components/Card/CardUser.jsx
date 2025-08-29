// src/components/Card/CardUser.jsx

"use client";
import "./cardUser.css";
import React, { useEffect, useState } from "react";
import BtnChat from "@/components/BtnChatUser/Btnchat";
import Chat from "@/components/Chat/Chat.jsx";
import Progress from "@/components/progress/progress-bar.jsx";
import { getCookie } from "cookies-next";

export default function Carrosel({ chamados = [] }) {
  const [funcao, setFuncao] = useState("");
  const [iniciais, setIniciais] = useState("");
  const [nomeExibido, setNomeExibido] = useState("");

  useEffect(() => {
    const funcaoCookie = getCookie("funcao");
    const nome = getCookie("nome");

    if (funcaoCookie) setFuncao(funcaoCookie);

    if (nome) {
      const partes = nome.trim().split(" ");
      const iniciaisCalculadas =
        (partes[0]?.charAt(0).toUpperCase() || '') +
        (partes[partes.length - 1]?.charAt(0).toUpperCase() || '');
      const nomeExibidoCalculado = `${partes[0]?.charAt(0).toUpperCase() + partes[0]?.slice(1).toLowerCase()} ${
        partes[partes.length - 1]
          ? partes[partes.length - 1].charAt(0).toUpperCase() +
            partes[partes.length - 1].slice(1).toLowerCase()
          : ''
      }`;
      setIniciais(iniciaisCalculadas);
      setNomeExibido(nomeExibidoCalculado);
    }
  }, []);

  const prioridades = {
    1: "Intervenção Preventiva",
    2: "Intervenção Sem Urgência",
    3: "Intervenção Prioritária",
    4: "Intervenção Imediata",
  };

  return (
    <>
      {Array(chamados).map((chamado) => {
        const isConcluido = chamado.status === "concluído";
        
        return (
          <div key={chamado.id} className="d-flex flex-wrap justify-content-center gap-4">
            <div
              className={`${
                isConcluido ? "card-desativado-user" : "card-user"
              } d-flex flex-column align-items-center justify-content-center`}
            >
              <div
                className={`card-prioridade-${chamado.grau_prioridade}-user d-flex align-items-center justify-content-center`}
              >
                <p>{prioridades[chamado.grau_prioridade]}</p>
              </div>

              <main className="d-grid mt-4">
                <div className="card-titulo-user ">
                  <h3>{chamado.titulo}</h3>
                
                </div>
                <div className="card-patrimonio-user d-grid w-100 justify-content-center align-items-center">
                  <p>{chamado.patrimonio}</p>
                </div>
                <div className="card-data-user d-grid w-100 justify-content-center align-items-center">
                  <p>
                    <b>Criado em:</b>{" "}
                    {new Date(chamado.criado_em).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="status-card-user d-flex align-items-center justify-content-center">
                  <p>{chamado.status}</p>
                </div>
                <div className="">
                  <Progress step={chamado.status} />
                </div>
              </main>

              <button
                  type="button"
                  className={`btn ${
                    isConcluido ? "btn-desativado" : ""
                  } mt-2 mb-3`}
                  data-bs-toggle="modal"
                  data-bs-target={`#modal-${chamado.id}`}
                >
                  <BtnChat />
                </button>

              {/* Modal */}
            </div>
            <div
              className="modal fade"
              id={`modal-${chamado.id}`}
              tabIndex={-1}
              aria-labelledby={`modalLabel-${chamado.id}`}
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-scrollable modal-lg modal-dialog-centered">
                <div className="modal-content flex-column flex-md-inline">
                  <div className="modal-header d-flex ms-4 align-items-center justify-content-center">
                    <h2 className="modal-title" id={`modalLabel-${chamado.id}`}>
                      <b>Ficha Técnica:</b>
                    </h2>
                    {chamado.tecnico_id ==  0 &&  (
                      <div className="modal-inicial-user d-md-grid d-none sticky-top bg-white">
                        <div className="d-flex">
                          <div className="img-avatar-user">
                            <p>{iniciais}</p>
                          </div>
                          <div className="nome-chat-user">{nomeExibido}</div>
                        </div>
                      </div>
                    ) }
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>

                  <div className="modal-body d-md-flex align-items-center justify-content-center d-grid">
                    <div className="ficha-user d-grid gap-0 m-0">
                      <p>
                        <b>Título:</b> {chamado.titulo}
                      </p>
                      <p>
                        <b>Prioridade:</b> {prioridades[chamado.grau_prioridade]}
                      </p>
                      <p>
                        <b>Criação: </b>
                        {new Date(chamado.criado_em).toLocaleDateString("pt-BR")}
                      </p>
                      <p>
                        <b>Técnico:</b>{" "}
                        {chamado.tecnico_id ? nomeExibido : "Sem Técnico Atribuído"}
                      </p>
                      <p>
                        <b>Patrimônio:</b> {chamado.patrimonio}
                      </p>
                      <p>
                        <b>Tipo:</b> {chamado.tipo_id}
                      </p>
                      <p>
                        <b>Descrição:</b> {chamado.descricao}
                      </p>
                    </div>
                   
                      <div className="chat-container-user">
                        <div className="modal-inicial-user d-md-none d-flex sticky-top bg-white">
                          <div className="d-flex">
                            <div className="img-avatar-user">
                              <p>{iniciais}</p>
                            </div>
                            <div className="nome-chat-user">{nomeExibido}</div>
                          </div>
                        </div>
                        <Chat idChamado={chamado.id} />
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}