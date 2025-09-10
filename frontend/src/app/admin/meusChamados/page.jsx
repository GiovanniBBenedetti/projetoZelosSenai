"use client";
import { useEffect, useState } from "react";
import "./meus_chamados.css";
import { getCookie } from 'cookies-next/client';
import CardUser from "@/components/Card/CardUser";
import BtnVenhaCriar from "@/components/BtnVenhaCriar/BtnVenhaCriar"

export default function Meus_chamados() {
  const [chamados, setChamados] = useState([]);

  useEffect(() => {
    const tipo = getCookie('funcao');
    const token = getCookie('token');
    fetch(`http://localhost:8080/meusChamados?tipo=${tipo}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((informacao) => {
        const chamadosTecnico = informacao
        setChamados(chamadosTecnico)
        console.log(chamadosTecnico)
      })
      .catch((error) => console.error("Erro ao buscar chamados:", error))
  }, []);

  const status = {
    'procurando responsável': 0,
    'enviado': 1,
    'concluído': 2
  }

  const ordenarChamados = () => {
    return chamados.sort((a, b) => {
      const statusA = status[a.status];
      const statusB = status[b.status];

      if (statusA === 2 && statusB !== 2) return 1;
      if (statusB === 2 && statusA !== 2) return -1;

      if (statusA !== 2 && statusB !== 2) {
        return parseInt(b.grau_prioridade) - parseInt(a.grau_prioridade);
      }
      return 0;
    });
  };

  return (
    <>
      <div>
        <div className="">
          <img
            src="/img/meuschamadosDesk.png"
            alt=""
            className="bannerChamadosArea d-none d-md-block img-fluid"
          />


          <img
            src="/img/meuschamadosCel.png"
            alt=""
            className="bannerChamadosArea d-block d-md-none img-fluid"

          />
        </div>

        {chamados.length === 0 ? (
          <div className="d-grid mt-4 align-items-center justify-content-center">

            <h3 className="text-center">Ops! Você não possui nenhum chamado criado</h3>
            <div className="align-items-center mt-2 mb-3 d-flex justify-content-center">
              <BtnVenhaCriar />
            </div>

          </div>
        ) : (
          <div>
            {ordenarChamados(chamados).map((chamado) => {
              return (
                <CardUser key={chamado.id} chamados={[chamado]} />
              )

            })}
          </div>
        )}
      </div>
    </>
  );
}
