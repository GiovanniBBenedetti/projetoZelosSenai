'use client';
import './tec.css';
import { getCookie } from 'cookies-next';
import { useEffect } from 'react';
import Link from 'next/link';

export default function TecDashboard() {
  useEffect(() => {
    const funcao = getCookie('funcao');
    if (funcao !== 'tecnico') {
      window.location.href = '/'; 
    }
  }, []);

  return (
    <>
        <div className="container-fluid dashboard-tec">
        <div className="row tec-dash">
        <div className="col-md-4 mt-4 card-information-col">
          <Link href="/tecnico/todosChamados" className="card-information">
            <div className="text-content">
              <p>20 Chamados</p>
              <span>Sem responsáveis</span>
            </div>
            <i className="bi bi-caret-right-fill"></i>
          </Link>
        </div>
        <div className="col-md-4 mt-4 card-information-col">
          <Link href="/tecnico/chamados" className="card-information">
            <div className="text-content">
              <p>30 Chamados</p>
              <span>Atribuídos a mim</span>
            </div>
            <i className="bi bi-caret-right-fill"></i>
          </Link>
        </div>
        <div className="col-md-4 mt-4 card-information-col">
          <div className="card-information">
            <div className="text-content">
              <p>10 Chamados</p>
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
      </div>


        </div>
    </>
  );
}
