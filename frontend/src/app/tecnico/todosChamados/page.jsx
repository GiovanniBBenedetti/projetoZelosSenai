"use client";
import "./chamados.css";
import CardVirgem from "@/components/Card/CardVirgem";
import BtnVenhaCriar from "@/components/BtnVenhaCriar/BtnVenhaCriar";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";

export default function Meus_chamados() {
  const [chamados, setChamados] = useState([]);
  const [contador, setContador] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  async function carregarChamados() {
    const token = getCookie("token");
    try {
      const response = await fetch(`http://localhost:8080/chamadosArea?page=${contador}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const informacao = await response.json();
        setChamados(informacao.data);
        setTotalPaginas(informacao.pagination.totalPages);
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
  }, [contador]);

  const status = {
    "procurando responsável": 0,
    "em andamento": 1,
    concluído: 2,
  };

  function handleClickContador() {
    if (contador < totalPaginas) {
      setContador(contador + 1);
    }
  }

  function handleClickDiminuir() {
    if (contador > 1) {
      setContador(contador - 1);
    }
  }

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

  return (
    <>
      <div className="titulo-meus-chamados-tecnico align-items-center d-none d-md-flex justify-content-center mt-4 mb-4">
        <h1>Chamados da Área</h1>
      </div>

      <div className="contador mt-4 d-flex justify-content-start align-items-center gap-2">
        <h4>Página {contador} de {totalPaginas}</h4>
        <i
          onClick={handleClickDiminuir}
          className={`bi bi-caret-left ${contador <= 1 ? 'disabled' : ''}`}
        />
        <i
          onClick={handleClickContador}
          className={`bi bi-caret-right ${contador >= totalPaginas ? 'disabled' : ''}`}
        />
      </div>

      {chamados.length === 0 ? (
        <div className="d-grid mt-4 align-items-center justify-content-center">

          <h3 className="text-center">Ops! Não possui chamados na sua área</h3>
          <div className="align-items-center mt-2 mb-3 d-flex justify-content-center">
            <BtnVenhaCriar />
          </div>

        </div>
      ) : (
        <div>
          {ordenarChamados(chamados).map((chamado) => {
            return (
              <CardVirgem key={chamado.id} chamados={[chamado]} />
            )

          })}
        </div>
      )}
    </>
  );
}