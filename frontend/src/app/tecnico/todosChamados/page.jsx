"use client";
import "./chamados.css";
import CardVirgem from "@/components/Card/CardVirgem"
import BtnVenhaCriar from "@/components/BtnVenhaCriar/BtnVenhaCriar";
import Link from "next/link";
import { getCookie } from 'cookies-next'
import { useEffect, useState } from "react";

export default function Meus_chamados() {
  const [chamados, setChamados] = useState([]);

  async function carregarChamados() {
    const token = getCookie("token");
    try {
      const response = await fetch("http://localhost:8080/chamadosArea", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const informacao = await response.json();
        setChamados(informacao);
        console.log(informacao);
      } else {
        console.error("Erro na resposta da API:", response.status);
        setChamados([]);
      }

    } catch (error) {
      console.error("Erro ao buscar chamados:", error);
      setChamados([]);
    }
  }

  useEffect(() => {
    carregarChamados();
  }, []);


  const status = {
    "procurando responsável": 0,
    "em andamento": 1,
    concluído: 2,
  };

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
    <div className="titulo-meus-chamados-tecnico align-items-center d-none d-md-flex justify-content-center mt-4 mb-4">
        <h1>Chamados da Área</h1>
      </div>

      <div className="conteudo-com-sidebar-meus-chamados-tecnico">
        {chamados.length === 0 ? (
          <div className="sem-chamados d-grid justify-content-center align-items-center">
            <img src="/img/fundo_semChamados.png" className='img-fluid' alt="" />
            <p>Ops! Você não possui nenhum chamado</p>
            <div className="">
              <BtnVenhaCriar />
            </div>

          </div>
        ) : (
          <div className="cards-meus-chamados-tecnico d-flex align-items-center justify-content-center flex-wrap gap-4">
            {ordenarChamados(chamados).map((chamado) => (
              <div key={chamado.id} className="d-grid flex-wrap">
                <CardVirgem chamados={[chamado]} />
              </div>
            ))}
          </div>
        )}
      </div>
      </>
  );
}
