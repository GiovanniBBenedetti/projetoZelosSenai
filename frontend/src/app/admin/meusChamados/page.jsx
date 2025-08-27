"use client";
import { useEffect, useState } from "react";
import "./meus_chamados.css";
import { getCookie } from 'cookies-next/client';
import CardUser from "@/components/Card/CardUser";
import BtnVenhaCriar from "@/components/BtnVenhaCriar/BtnVenhaCriar"

export default function Meus_chamados() {
  const [chamados, setChamados] = useState([]);

  useEffect(() => {
    const usuarioId = parseInt(getCookie('idUsuario'));

    fetch("http://localhost:8080/chamado")
      .then((response) => response.json())

      .then((informacao) => {
        const chamadosUser = informacao.filter(
          (chamado) => chamado.usuario_id === usuarioId
        );
        setChamados(chamadosUser);
        console.log(chamadosUser)
      })
      .catch((error) => console.error("Erro ao buscar chamados:", error));
  }, []);

  const status ={
    "procurando responsável": 0,
    "em andamento": 1,
    "concluído": 2,
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
      <div className="img-senai-meus-chamados d-sm-block d-none">
        <img src="/fundo.png" alt="" className="img-fluid" />
      </div>

      <div className="titulo-meus-chamados-cel mt-4 align-items-center d-flex d-md-none justify-content-center">
        <h2>Meus Chamados</h2>
      </div>

      <div className="titulo-meus-chamados align-items-center d-none d-md-flex justify-content-center mt-4">
        <h2>Meus Chamados</h2>
      </div>

      <div className="conteudo-com-sidebar">
        {chamados.length === 0 ? (
          <div className="sem-chamados d-grid justify-content-center align-items-center">
            <img src="/fundo_semChamados.png" className='img-fluid' alt="" />
            <p>Ops! Você não possui nenhum chamado</p>
            <div className="">
               <BtnVenhaCriar />
            </div>
           
          </div>
        ) : (
          <div className="cards-meus-chamados d-flex align-items-center justify-content-center flex-wrap gap-4">
            {ordenarChamados(chamados).map((chamado) => (
              <div key={chamado.id} className="d-grid flex-wrap">
                <CardUser chamados={chamado} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
