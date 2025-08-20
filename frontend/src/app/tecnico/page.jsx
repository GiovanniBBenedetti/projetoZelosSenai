'use client';
import './tec.css';
import { getCookie } from 'cookies-next';
import { useEffect } from 'react';

export default function TecnicoHome() {
  useEffect(() => {
    const funcao = getCookie('funcao');
    if (funcao !== 'tecnico') {
      window.location.href = '/'; 
    }
  }, []);

  return (
    <>
      <style type="text/css">
        {`
          .dashboard {
            background-color: var(--branco) !important;
            color: var(--vermelho) !important;
            margin-left: 0 !important;
          };
        `}
      </style>
      <div className="body-content">
        <div className="fundo-red"></div>
        <div className="container-fluid content">
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
      </div>
    </>
  );
}
