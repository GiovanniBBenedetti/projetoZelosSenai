"use client";
import { useEffect, useMemo, useState } from "react";
import "./meus_chamados.css";
import { getCookie } from "cookies-next/client";
import CardUser from "@/components/Card/CardUser";
import BtnVenhaCriar from "@/components/BtnVenhaCriar/BtnVenhaCriar";

export default function Meus_chamados() {
  const [chamados, setChamados] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5); 
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");


  const [count, setCount] = useState(0); 
  const [serverPage, setServerPage] = useState(1);
  const [serverLimit, setServerLimit] = useState(limit);
  const [totalPages, setTotalPages] = useState(null); 
  const tipo = getCookie("funcao");
  const token = getCookie("token");

  const statusOrder = {
    "procurando responsável": 0,
    enviado: 1,
    concluído: 2,
  };

  const ordenarChamados = (lista) => {
    const copia = [...lista];
    return copia.sort((a, b) => {
      const sa = statusOrder[a.status] ?? 99;
      const sb = statusOrder[b.status] ?? 99;

      if (sa === 2 && sb !== 2) return 1;
      if (sb === 2 && sa !== 2) return -1;

      if (sa !== 2 && sb !== 2) {
        const pa = parseInt(a.grau_prioridade ?? 0);
        const pb = parseInt(b.grau_prioridade ?? 0);
        return pb - pa;
      }
      return 0;
    });
  };

  const fetchChamados = async () => {
    if (!token) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const url = new URL("http://localhost:8080/meusChamados");
      if (tipo) url.searchParams.set("tipo", tipo);
      url.searchParams.set("page", String(page));
      url.searchParams.set("limit", String(limit));

      const resp = await fetch(url.toString(), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!resp.ok) {
        const texto = await resp.text();
        throw new Error(texto || "Falha ao buscar chamados");
      }

      const payload = await resp.json();

   
      if (Array.isArray(payload)) {
        if (payload.length === 0 && page > 1) {
          setPage((p) => Math.max(1, p - 1));
          return; 
        }
        setChamados(payload);
        setCount(payload.length);
        setServerPage(page);
        setServerLimit(limit);
        setTotalPages(null);
      } else {
      
        const data = payload.data ?? [];
        const countPage = Number(payload.count ?? data.length);
        const apiPage = Number(payload.page ?? page);
        const apiLimit = Number(payload.limit ?? limit);
        const apiTotalPages =
          payload.totalPages != null ? Number(payload.totalPages) : null;

        if (data.length === 0 && page > 1) {
          setPage((p) => Math.max(1, p - 1));
          return; 
        }

        setChamados(data);
        setCount(countPage);
        setServerPage(apiPage);
        setServerLimit(apiLimit);
        setTotalPages(apiTotalPages);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Erro ao buscar chamados.");
      setChamados([]);
      setTotalPages(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChamados();

  }, [page, tipo, token]);


  const hasPrev = page > 1;
  const hasNext = totalPages != null ? page < totalPages : count >= serverLimit;

  const chamadosOrdenados = useMemo(() => ordenarChamados(chamados), [chamados]);

  const handlePrev = () => {
    if (hasPrev && !loading) setPage((p) => Math.max(1, p - 1));
  };
  const handleNext = () => {
    if (hasNext && !loading) setPage((p) => p + 1);
  };

  return (
    <>
      <div>
        <div>
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

        {errorMsg && <p className="text-danger text-center">{errorMsg}</p>}

        {!loading && chamadosOrdenados.length === 0 ? (
          <div className="d-grid mt-4 align-items-center justify-content-center mb-5">
            <div className="justify-content-center d-flex">
              <img
                src="/img/iconeSemChamados.png"
                className="img-fluid icon-semchamados"
                alt=""
              />
            </div>
            <h3 className="text-center">Ops! Você não possui nenhum chamado criado</h3>
            <div className="align-items-center mt-2 mb-3 d-flex justify-content-center">
              <BtnVenhaCriar />
            </div>
          </div>
        ) : (
          <div className="mb-5">
            {chamadosOrdenados.map((chamado) => (
              <CardUser key={chamado.id} chamados={[chamado]} />
            ))}

            {/* Paginação central com seu estilo */}
            <div className="d-flex justify-content-center align-items-center gap-3 my-4">
              <button
                className="btn btn-paginacao"
                onClick={handlePrev}
                disabled={!hasPrev || loading}
              >
                <i className="bi bi-caret-left"></i> Anterior
              </button>

              <span className="px-3 py-1 bg-light rounded border">
                Página <strong>{serverPage}</strong>
                {totalPages != null && (
                  <>
                    {" "}
                    de <strong>{totalPages}</strong>
                  </>
                )}
              </span>

              <button
                className="btn btn-paginacao"
                onClick={handleNext}
                disabled={!hasNext || loading}
              >
                Próximo <i className="bi bi-caret-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
