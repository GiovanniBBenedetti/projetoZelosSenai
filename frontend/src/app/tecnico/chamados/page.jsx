"use client";
import { useEffect, useState } from "react";
import "./chamados.css";
import { getCookie } from 'cookies-next/client';
import CardTecnico from "@/components/Card/CardTecnico";
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
        setChamados(informacao);
      })
      .catch((error) => console.error("Erro ao buscar chamados:", error));
  }, []);

  const status = {
    'procurando responsável': 0,
    'enviado': 1,
    'concluído': 2
  };

  const ordenarChamados = () => {
    return [...chamados].sort((a, b) => {
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

  const chamadosOrdenados = ordenarChamados();
  const chamadosConcluidos = chamadosOrdenados.filter(c => c.status === "concluído");
  const chamadosNaoConcluidos = chamadosOrdenados.filter(c => c.status !== "concluído");

  return (
    <div>
      <div className="">
        <img
          src="/img/meusChamadosDesk.png"
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
        <div className="d-grid mt-4 align-items-center justify-content-center mb-5">
          <div className="justify-content-center d-flex">
            <img src="/img/iconeSemChamados.png" className='img-fluid icon-semchamados' alt="" />
          </div>
          <h3 className="text-center">Ops! Você não possui nenhum chamado criado</h3>
          <div className="align-items-center mt-2 mb-3 d-flex justify-content-center">
            <BtnVenhaCriar />
          </div>
        </div>
      ) : (
        <div className="mb-5">
          {/* Chamados ativos */}
          {chamadosNaoConcluidos.map((chamado) => (
            <div key={chamado.id}>
              <CardTecnico chamados={[chamado]} />
            </div>
          ))}

          {/* Accordion Chamados Concluídos */}
          {chamadosConcluidos.length > 0 && (
            <div className="accordion-chamados-tecnico accordion-flush mt-2" id="accordionFlushExample">
              <div className="accordion-item">
                <h2 className="accordion-header accordion-headerChamados">
                  <button
                    className="accordion-button collapsed gap-1 d-flex"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseOne"
                    aria-expanded="false"
                    aria-controls="flush-collapseOne"
                  >
                    Chamados Concluídos
                    <i className="bi bi-chevron-right pt-2 ps-md-2"></i>
                  </button>
                  
                </h2>
                <div
                  id="flush-collapseOne"
                  className="accordion-collapse collapse mt-4"
                  data-bs-parent="#accordionFlushExample"
                >
                  <div className="accordion-body">
                    {chamadosConcluidos.map((chamado) => (
                      <CardTecnico key={chamado.id} chamados={[chamado]} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
