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

  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroPrioridade, setFiltroPrioridade] = useState("");
  const [filtroData, setFiltroData] = useState("");

  async function carregarChamados() {
    const token = getCookie("token");
    try {
      const response = await fetch(
        `http://localhost:8080/chamadosArea?page=${contador}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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
    if (contador < totalPaginas) setContador(contador + 1);
  }

  function handleClickDiminuir() {
    if (contador > 1) setContador(contador - 1);
  }

  const ordenarChamados = () => {
    let lista = [...chamados];

    if (filtroStatus !== "todos") {
      lista = lista.filter(ch => ch.status === filtroStatus);
    }
    if (filtroTipo) {
      lista = lista.filter(ch => ch.tipo_chamado === filtroTipo);
    }
    if (filtroPrioridade) {
      lista = lista.filter(ch => String(ch.grau_prioridade) === filtroPrioridade);
    }
    if (filtroData) {
      lista = lista.filter(ch => ch.criado_em.startsWith(filtroData));
    }

    return lista.sort((a, b) => {
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

      {/* Layout responsivo */}
      <div className="d-flex flex-column flex-md-row gap-4 mt-4">
      <div className="col-12 col-md-3 order-0 order-md-2 mb-3 mb-md-0">
  <div className="filtros p-3 shadow rounded">
    <h3>Filtrar Chamados</h3>

    {/* Tipo de chamado */}
    <div className="mb-3">
      <label className="form-label">Tipo de Chamado</label>
      <select
        className="form-select filtro-select"
        value={filtroTipo}
        onChange={(e) => setFiltroTipo(e.target.value)}
      >
        <option value="">Todos</option>
        <option value="suporte">Suporte</option>
        <option value="incidente">Incidente</option>
        <option value="manutenção">Manutenção</option>
        <option value="outro">Outro</option>
      </select>
    </div>

    {/* Grau de prioridade */}
    <div className="mb-3">
      <label className="form-label">Grau de Prioridade</label>
      <select
        className="form-select filtro-select"
        value={filtroPrioridade}
        onChange={(e) => setFiltroPrioridade(e.target.value)}
      >
        <option value="">Todos</option>
        <option value="1">Baixa</option>
        <option value="2">Média</option>
        <option value="3">Alta</option>
      </select>
    </div>

    {/* Data de criação */}
    <div className="mb-3">
      <label className="form-label">Data de Criação</label>
      <input
        type="date"
        className="form-control filtro-input"
        value={filtroData}
        onChange={(e) => setFiltroData(e.target.value)}
      />
    </div>

    <button
      className="btn-verperfil w-100 mt-2"
      onClick={() => carregarChamados()}
    >
      Aplicar Filtro
    </button>
  </div>
</div>


        {/* LISTA DE CHAMADOS */}
        <div className="flex-grow-1 order-1 order-md-1">
          {ordenarChamados().length === 0 ? (
            <div className="d-grid mt-4 align-items-center justify-content-center">
              <h3 className="text-center">Ops! Não possui chamados na sua área</h3>
              <div className="align-items-center mt-2 mb-3 d-flex justify-content-center">
                <BtnVenhaCriar />
              </div>
            </div>
          ) : (
            ordenarChamados().map((chamado) => (
              <CardVirgem key={chamado.id} chamados={[chamado]} />
            ))
          )}
        </div>
      </div>

      {/* PAGINAÇÃO */}
<div className="d-flex justify-content-center align-items-center gap-3 my-4">
  <button
    className="btn btn-outline-primary"
    onClick={handleClickDiminuir}
    disabled={contador <= 1}
  >
    <i className="bi bi-caret-left"></i> Anterior
  </button>

  <span className="px-3 py-1 bg-light rounded border">
    Página <strong>{contador}</strong> de <strong>{totalPaginas}</strong>
  </span>

  <button
    className="btn btn-outline-primary"
    onClick={handleClickContador}
    disabled={contador >= totalPaginas}
  >
    Próximo <i className="bi bi-caret-right"></i>
  </button>
</div>

    </>
  );
}
