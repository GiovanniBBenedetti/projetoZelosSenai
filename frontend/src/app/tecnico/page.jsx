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
        <div className="row">
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

          <div className="andamento">
            <h3 className="titulo-user">Chamados em Andamento</h3>
            <div className="row row-cols-1 row-cols-md-3 g-4"></div>
          </div>
          <div className="resolvidos">
            <h3 className="titulo-user">Chamados Resolvidos</h3>
            <div className="row row-cols-1 row-cols-md-3 g-4 cards-resolvidos">
              <div className="col">
                <div className="card h-100">
                  <img
                    src="https://placehold.co/600x400"
                    className="card-img-top"
                    alt="..."
                  />
                  <div className="card-body">
                    <h5 className="card-title">Card title</h5>
                    <p className="card-text">
                      This is a longer card with supporting text below as a
                      natural lead-in to additional content. This content is a
                      little bit longer.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card h-100">
                  <img
                    src="https://placehold.co/600x400"
                    className="card-img-top"
                    alt="..."
                  />
                  <div className="card-body">
                    <h5 className="card-title">Card title</h5>
                    <p className="card-text">This is a short card.</p>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card h-100">
                  <img
                    src="https://placehold.co/600x400"
                    className="card-img-top"
                    alt="..."
                  />
                  <div className="card-body">
                    <h5 className="card-title">Card title</h5>
                    <p className="card-text">
                      This is a longer card with supporting text below as a
                      natural lead-in to additional content.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </>
  );
}
