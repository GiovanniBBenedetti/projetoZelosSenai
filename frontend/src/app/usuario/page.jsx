'use client';

import { useState, useEffect } from 'react';
import { getCookie } from 'cookies-next';
import Loader from '@/components/Loader/Loader';
import CardUser from '@/components/Card/CardUser';
import BtnVenhaCriar from "@/components/BtnVenhaCriar/BtnVenhaCriar";
import "./home.css";
import Link from 'next/link';

export default function UserDashboard() {
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const statusPrioridade = {
    'enviado': 0,
    'procurando responsável': 1,
    'em andamento': 2,
    'concluído': 3,
  };

  useEffect(() => {
    const usuarioId = parseInt(getCookie('idUsuario'));
    const token = getCookie('token');

    if (!usuarioId || !token) {
      setError('Usuário não autenticado.');
      setLoading(false);
      return;
    }

    fetch("http://localhost:8080/chamado", {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao buscar os chamados.');
        }
        return response.json();
      })
      .then((informacao) => {
        const chamadosUser = informacao.filter(
          (chamado) => chamado.usuario_id === usuarioId
        );
        setChamados(chamadosUser);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const ordenarChamados = (listaChamados) => {
    return [...listaChamados].sort((a, b) => {
      const statusA = statusPrioridade[a.status];
      const statusB = statusPrioridade[b.status];

      if (statusA !== statusB) {
        return statusB - statusA;
      }

      return parseInt(b.grau_prioridade) - parseInt(a.grau_prioridade);
    });
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p>Erro: {error}</p>;
  }

  const chamadosEmAndamento = chamados.filter(
    (chamado) => chamado.status !== 'concluído'
  );
  const chamadosResolvidos = chamados.filter(
    (chamado) => chamado.status === 'concluido'
  );

  return (
    <div className="container-fluid dashboard-user">
      <div className="row">
        <div className="col-md-4 mt-4 card-information-col">
          <Link href="/usuario/criar" className="card-information">
            <div className="text-content">
              <p>Criar chamado</p>
              <span>Informe sua demanda</span>
            </div>
            <i className="bi bi-caret-right-fill"></i>
          </Link>
        </div>
        <div className="col-md-4 mt-4 card-information-col">
          <Link href="/usuario/meusChamados" className="card-information">
            <div className="text-content">
              <p>{chamadosEmAndamento.length} Chamados</p>
              <span>Em andamento</span>
            </div>
            <i className="bi bi-caret-right-fill"></i>
          </Link>
        </div>
        <div className="col-md-4 mt-4 card-information-col">
          <div className="card-information">
            <div className="text-content">
              <p>{chamadosResolvidos.length} Chamados</p>
              <span>Criados no ultimo semestre</span>
            </div>
          </div>
        </div>
        <div className="col-md-12 mt-3 ajuda-container-col">
          <div className="card-ajuda">
            <div className="text-content">
              <p>Precisa de ajuda?</p>
              <span>Está com dúvidas ou problemas? Envie uma mensagem para o nosso suporte.</span>
            </div>
            <a href="/usuario/suporte"><button className='btn-ajuda'>Enviar Mensagem</button></a>
          </div>
        </div>
      </div>


      {/* {chamadosEmAndamento.length > 0 && (
        <div className="chamados-andamento-container mt-5">
          <h2 className="text-center">Chamados em Andamento</h2>
          <div className="d-flex flex-wrap justify-content-center gap-4 mt-4">
            {ordenarChamados(chamadosEmAndamento).map((chamado) => (
              <div key={chamado.id}>
                <CardUser chamados={[chamado]} />
              </div>
            ))}
          </div>
        </div>
      )}

      {chamadosResolvidos.length > 0 && (
        <div className="chamados-resolvidos-container mt-5">
          <h2 className="text-center">Chamados Resolvidos</h2>
          <div className="d-flex flex-wrap justify-content-center gap-4 mt-4">
            {ordenarChamados(chamadosResolvidos).map((chamado) => (
              <div key={chamado.id}>
                <CardUser chamados={[chamado]} />
              </div>
            ))}
          </div>
        </div>
      )}

      {chamados.length === 0 && (
        <div className="sem-chamados d-grid justify-content-center align-items-center mt-5">
          <img src="/fundo_semChamados.png" className='img-fluid' alt="" />
          <p>Ops! Você não possui nenhum chamado</p>
          <div className="">
            <BtnVenhaCriar />
          </div>
        </div>
      )} */}
    </div>
  );
}