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
    (chamado) => chamado.status === 'Em andamento'
  ).slice(0, 3);

  const chamadosResolvidos = chamados.filter(
    (chamado) => chamado.status === 'concluído'
  ).sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em)).slice(0, 3);

  return (
    <div className="container-fluid dashboard-user">
      <div className="row user-dash">
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
              <span>Concluídos recentemente</span>
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
      
      <div className="row mt-4">
        <div className="col-12">
          <h3 className="mb-3">Chamados em Andamento</h3>
          {chamadosEmAndamento.length > 0 ? (
            <CardUser chamados={chamadosEmAndamento} />
          ) : (
            <p>Nenhum chamado em andamento encontrado.</p>
          )}
        </div>

        <div className="col-12 mt-4">
          <h3 className="mb-3">Chamados Concluídos</h3>
          {chamadosResolvidos.length > 0 ? (
            <CardUser chamados={chamadosResolvidos} />
          ) : (
            <p>Nenhum chamado concluído encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
}