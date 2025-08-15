
import './home.css';

export default function UserHome() {



  return (
    <>
      <style type="text/css">
        {`
          .dashboard {
            background-color: var(--branco) !important;
            color: var(--vermelho) !important;
            margin-left: 0 !important;
          }
        `}
      </style>

      <div className="body-content">
        <div className="fundo-red"></div>
        <div className="container-fluid content">
          <div className="resolvidos">
            <h3 className="titulo-user">Chamados Resolvidos</h3>
            <div className="row row-cols-1 row-cols-md-3 g-4">
              {/* Aqui você pode mapear os chamados resolvidos */}
            </div>
          </div>

          <div className="andamento">
            <h3 className="titulo-user">Em Andamento</h3>
            <div className="row row-cols-1 row-cols-md-3 g-4 cards-andamento">
              {[1, 2, 3].map((_, i) => (
                <div className="col" key={i}>
                  <div className="card h-100">
                    <img
                      src="https://placehold.co/600x400"
                      className="card-img-top"
                      alt="..."
                    />
                    <div className="card-body">
                      <h5 className="card-title">Card title</h5>
                      <p className="card-text">
                        {i === 1
                          ? 'This is a short card.'
                          : 'This is a longer card with supporting text below as a natural lead-in to additional content.'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
