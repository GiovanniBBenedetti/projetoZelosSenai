'use client';
import './tec.css';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Loader from '@/components/Loader/Loader';
import Card from '@/components/Card/CardTecnico';

export default function TecDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentes, setRecentes] = useState([]);
  const [semResponsavel, setSemResponsavel] = useState(0);
  const [atribuidos, setAtribuidos] = useState(0);
  const [finalizados, setFinalizados] = useState(0);


  const fetchChamados = async () => {
    const token = getCookie('token');
    const funcao = getCookie('funcao');
    try {
      const response = await fetch(`http://localhost:8080/chamado/recente?funcao=${funcao}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar os chamados.');
      }

      const recentesChamados = await response.json();
      setRecentes(recentesChamados)


    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    try {
    
      const semRespRes = await fetch(`http://localhost:8080/chamado?status=enviado`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const semRespData = await semRespRes.json();
      setSemResponsavel(semRespData.length);


      const atribuidosRes = await fetch(`http://localhost:8080/meusChamados?status=em andamento`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const atribuidosData = await atribuidosRes.json();
      setAtribuidos(atribuidosData.length);

    
      const finalizadosRes = await fetch(`http://localhost:8080/meusChamados?status=concluido`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const finalizadosData = await finalizadosRes.json();
      setFinalizados(finalizadosData.length);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };




  useEffect(() => {
    const funcao = getCookie('funcao');
    if (funcao !== 'tecnico') {
      window.location.href = '/';
      return;
    }

    const tecnicoId = parseInt(getCookie('idUsuario'));
    const token = getCookie('token');

    if (!tecnicoId || !token) {
      setError('Técnico não autenticado.');
      setLoading(false);
      return;
    }

    fetchChamados();
  }, []);



  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p>Erro: {error}</p>;
  }

  return (
    <>
      <div className="container-fluid dashboard-tec">
        <div className="row tec-dash">
        <div className="col-md-4 mt-4 card-information-col">
          <Link href="/tecnico/todosChamados" className="card-information">
            <div className="text-content">
              <p>{semResponsavel} Chamados</p>
              <span>Sem responsáveis</span>
            </div>
            <i className="bi bi-caret-right-fill"></i>
          </Link>
        </div>
          <div className="col-md-4 mt-4 card-information-col">
            <Link href="/tecnico/chamados" className="card-information">
              <div className="text-content">
                <p>{atribuidos} Chamados</p>
                <span>Atribuídos a mim</span>
              </div>
              <i className="bi bi-caret-right-fill"></i>
            </Link>
          </div>
          <div className="col-md-4 mt-4 card-information-col">
          <div className="card-information">
            <div className="text-content">
              <p>{finalizados} Chamados</p>
              <span>Finalizados nos últimos 30 dias</span>
            </div>
          </div>
        </div>
          <div className="col-md-12 mt-3 ajuda-container-col">
            <div className="card-ajuda">
              <div className="text-content">
                <p>Precisa de ajuda?</p>
                <span>Está com dúvidas ou problemas? Envie uma mensagem para o nosso suporte.</span>
              </div>
              <a href="/tecnico/suporte"><button className='btn-ajuda'>Enviar Mensagem</button></a>
            </div>
          </div>

          <div className="col-md-12 mt-4 dash-tec-recentes">
            <p className='dash-tec-title mt-2 mb-4'>Meus chamados mais recentes</p>
            <Card chamados={recentes} />
            <a className='d-flex justify-content-center mt-3' href="/tecnico/chamados"><button className='btn dash-tec-btn'>Ver todos</button></a>
          </div>
        </div>
      </div>

    </>
  );
}