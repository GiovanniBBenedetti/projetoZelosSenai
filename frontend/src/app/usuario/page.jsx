'use client';

import { useState, useEffect } from 'react';
import { getCookie } from 'cookies-next';
import CardUser from '@/components/Card/CardUser';
import Link from 'next/link';
import BtnVenhaCriar from "@/components/BtnVenhaCriar/BtnVenhaCriar";
import "./home.css";

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
    return <p>Carregando...</p>;
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
      <div className="row mt-4">
        <div className="col-md-4 mb-3">
          <Link href="/usuario/criar-chamado" className="card-btn-link">
            <button className="dashboard-btn-info">
              Criar chamado
              <span className="info-subtext">Não perca tempo!</span>
            </button>
          </Link>
        </div>
        <div className="col-md-4 mb-3">
          <Link href="/usuario/meus-chamados" className="card-btn-link">
            <button className="dashboard-btn-info">
              {chamadosEmAndamento.length} Chamados
              <span className="info-subtext">Em andamento</span>
            </button>
          </Link>
        </div>
        <div className="col-md-4 mb-3">
          <Link href="/usuario/meus-chamados" className="card-btn-link">
            <button className="dashboard-btn-info">
              {chamadosResolvidos.length} Chamados
              <span className="info-subtext">Resolvidos</span>
            </button>
          </Link>
        </div>
      </div>

      <div className="ajuda-container mt-5 p-4 rounded-3 d-flex flex-column flex-md-row align-items-center justify-content-between">
        <div className="text-content">
          <h4 className="ajuda-title">Precisa de ajuda?</h4>
          <p className="ajuda-subtitle">Está com dúvidas ou problemas? Envie uma mensagem para o nosso suporte.</p>
        </div>
        <Link href="/usuario/ajuda" className="btn btn-danger mt-3 mt-md-0">
          Enviar Mensagem
        </Link>
      </div>

      {chamadosEmAndamento.length > 0 && (
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
      )}
    </div>
  );
}