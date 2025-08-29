"use client";
import "./cardVirgem.css";
import React, { useEffect, useState } from "react";
import BtnChat from "@/components/BtnChatUser/Btnchat";
import Chat from "@/components/Chat/Chat";
import BtnAtribuirTecnico from "@/components/BtnPegarChamado/BtnPegarChamado.jsx";
import Progress from "@/components/progress/progress-bar.jsx";
import { getCookie } from "cookies-next";

export default function Carrosel({ chamados = [] }) {
  const [funcao, setFuncao] = useState("");
  const [chamadosArray, setChamadosArray] = useState([]);


  useEffect(() => {
    const funcaoCookie = getCookie("funcao");
    setFuncao(funcaoCookie);
  });

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
        alert("Chamado atribuído com sucesso");
      } else {
        alert("Erro ao atribuir chamado");
      }
    } catch {
      alert("Erro ao enviar dados");
    }
  }


  const nomePerfil = "Davi Leocadio";
  const partes = nomePerfil.trim().split(" ");
  const iniciais =
    partes[0].charAt(0).toUpperCase() +
    partes[partes.length - 1].charAt(0).toUpperCase();
  const nomeExibido = `${partes[0]} ${partes[partes.length - 1]}`;

  const prioridades = {
    '1': "Intervenção Preventiva",
    '2': "Intervenção Sem Urgência",
    '3': "Intervenção Prioritária",
    '4': "Intervenção Imediata",
  };

  return (
    <>
      {chamados.map((chamado) => {
        return (
          <div key={chamado.id}>
            <div className={`card row card-virgem borderColorPrioridade-${chamado.grau_prioridade}-virgem`}>
              <div className="col-md-1 ms-3 align-items-center d-flex justify-content-center">
                <img src="/img/Fundo.png" className="img-fluid imgPerfil-virgem" />
              </div>

              <div className="col-md-4 align-items-center justify-content-center  d-grid">
                <div className="titulo-virgem justify-content-center align-items-center d-grid">
                    <h2>oiii</h2>
                  <p className="m-0">Iniciado no dia {new Date(chamado.criado_em).toLocaleDateString("pt-BR")}</p>
                </div>
              </div>

              <div className="col-md-3 align-items-center justify-content-center d-flex">
                <div className={`prioridade-virgem-${chamado.grau_prioridade} align-items-center justify-content-center d-flex`}>
                  <p className={`m-0 prioridadeP-${chamado.grau_prioridade}`}>{prioridades[chamado.grau_prioridade]}</p>
                </div>
              </div>

              <div className="col-md-2 align-items-center justify-content-center d-grid">
                <div className="align-items-center justify-content-center d-flex">
                  <p className="m-0">Usuario</p>
                </div>

                <p className="m-0">Davi Leocadio</p>
              </div>

              <div className="col-md-1">
                <i class="bi bi-plus"></i>
              </div>

            </div>
          </div>

        )
      })}
    </>
  );
}
