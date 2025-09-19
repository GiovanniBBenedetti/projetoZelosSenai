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
  const [recentes, setRecentes] = useState([]);
  const [emAndamentoCount, setEmAndamentoCount] = useState(0); 
  const [concluidosCount, setConcluidosCount] = useState(0);

  const fetchChamadosRecentes = async () => {
    const token = getCookie('token');
    const funcao = getCookie('funcao');
    try {
      const response = await fetch(`http://localhost:8080/chamado/recente?funcao=${funcao}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar os chamados recentes.');
      }

      const recentesChamados = await response.json();
      setRecentes(recentesChamados);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchChamadosEmAndamento = async () => {
    const token = getCookie('token');
    try {
      const response = await fetch(`http://localhost:8080/meusChamados?status=em andamento`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Erro ao buscar chamados em andamento.');

      const chamados = await response.json();
      setEmAndamentoCount(chamados.length);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchChamadosConcluidos = async () => {
    const token = getCookie('token');
    try {
      const response = await fetch(`http://localhost:8080/meusChamados?status=concluido`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Erro ao buscar chamados concluídos.');

      const chamados = await response.json();
      setConcluidosCount(chamados.length);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const usuarioId = parseInt(getCookie('idUsuario'));
    const token = getCookie('token');

    if (!usuarioId || !token) {
      setError('Usuário não autenticado.');
      setLoading(false);
      return;
    }

    Promise.all([fetchChamadosRecentes(), fetchChamadosEmAndamento(), fetchChamadosConcluidos()])
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div className="container-fluid dashboard-user">
      <div className="row user-dash">
        <div className="col-md-4 mt-4 card-information-col">
          <Link href="/usuario/criar" className="card-information">
            <div className="text-content">
              <p>Abrir chamado</p>
              <span>Informe sua demanda</span>
            </div>
            <i className="bi bi-caret-right-fill"></i>
          </Link>
        </div>

        <div className="col-md-4 mt-4 card-information-col">
          <Link href="/usuario/meusChamados" className="card-information">
            <div className="text-content">
              <p>{emAndamentoCount} Chamados</p>
              <span>Em andamento</span>
            </div>
            <i className="bi bi-caret-right-fill"></i>
          </Link>
        </div>

        <div className="col-md-4 mt-4 card-information-col">
          <div className="card-information">
            <div className="text-content">
              <p>{concluidosCount} Chamados</p>
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
        <div className="col-md-12">
          <p className="dash-user-title mt-2 mb-4">Chamados criados mais recentes</p>
          {recentes.length > 0 ? (
            <>
              <CardUser chamados={recentes} />
              <a href="/usuario/meusChamados" className='d-flex justify-content-center mt-3'>
                <button className='btn dash-user-btn'>Ver todos</button>
              </a>
            </>
          ) : (
            <>
                <p className='dash-user-mesage-null fs-5'>Nenhum chamado encontrado, precisa criar um?</p>
                <a className='dash-user-btn-null d-flex mt-3' href="/usuario/criar"><button className='btn dash-user-btn'>Abrir Chamado</button></a>
              </>
          )}
        </div>
      </div>
    </div>
  );
}
