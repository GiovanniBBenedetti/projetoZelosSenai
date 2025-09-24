"use client";
import "./chamados.css";
import CardVirgem from "@/components/Card/CardVirgem";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";

export default function Meus_chamados() {
  const [chamados, setChamados] = useState([]);
  const [contador, setContador] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroPrioridade, setFiltroPrioridade] = useState("");
  const [filtroData, setFiltroData] = useState("");


  async function carregarChamados() {
    const token = getCookie("token");
    try {
      const queryParams = new URLSearchParams({
        page: contador,
        status: filtroStatus !== "todos" ? filtroStatus : "",
        prioridade: filtroPrioridade,
        data: filtroData,
      }).toString();

      const response = await fetch(
        `http://localhost:8080/fitragemRotas/filtrar?${queryParams}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const informacao = await response.json();

        if (informacao.data.length === 0 && contador > 1) {
          setContador((prev) => prev - 1);
          return;
        }

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

  return (
    <>
      <div className="">
        <img
          src="/img/FundoChamadoArea.png"
          alt=""
          className="bannerChamadosArea d-none d-md-block img-fluid"
        />


        <img
          src="/img/ChamadosAreaResponsivo.png"
          alt=""
          className="bannerChamadosArea d-block d-md-none img-fluid"
          
        />
      </div>

      <div className="d-flex flex-column flex-md-row gap-4 mt-4">
        <div className="col-12 col-md-3 order-0 order-md-2 mb-3 mb-md-0">
          <div className="filtros p-3 shadow rounded">
            <h3>Filtrar Chamados</h3>

            <div className="mb-3">
              <label className="form-label">Grau de Prioridade</label>
              <select
                className="form-select filtro-select"
                value={filtroPrioridade}
                onChange={(e) => setFiltroPrioridade(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="1">Preventiva</option>
                <option value="2">Sem Urgência</option>
                <option value="3">Prioretária</option>
                <option value="4">Imediata</option>
              </select>
            </div>


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
              className="btn-verperfil w-100 mt-2 d-flex justify-content-center align-items-center"
              onClick={() => carregarChamados()}
            >
              Aplicar Filtro
            </button>

          </div>
        </div>

        <div className="flex-grow-1 order-1 order-md-1">
          {chamados.length === 0 ? (
            <div className="d-grid mt-4 align-items-center justify-content-center">
              <div className="justify-content-center d-flex">
                <img
                  src="/img/iconeSemChamados.png"
                  className="img-fluid icon-semchamados"
                  alt=""
                />
              </div>
              <h3 className="text-center">Ops! Não possui chamados na sua área</h3>
        
            </div>
          ) : (
            chamados.map((chamado) => (
              <CardVirgem key={chamado.id} chamados={[chamado]} />
            ))
          )}
        </div>
      </div>

      
      <div className="d-flex justify-content-center align-items-center gap-3 my-4">
        <button
          className="btn btn-paginacao"
          onClick={handleClickDiminuir}
          disabled={contador <= 1}
        >
          <i className="bi bi-caret-left"></i> Anterior
        </button>

        <span className="px-3 py-1 bg-light rounded border">
          Página <strong>{contador}</strong> de <strong>{totalPaginas}</strong>
        </span>

        <button
          className="btn btn-paginacao"
          onClick={handleClickContador}
          disabled={contador >= totalPaginas}
        >
          Próximo <i className="bi bi-caret-right"></i>
        </button>
      </div>
    </>
  );
}
