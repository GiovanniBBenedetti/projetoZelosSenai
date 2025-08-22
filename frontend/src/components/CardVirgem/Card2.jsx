'use client';
import { getCookie } from 'cookies-next';

export default function Carrosel({ chamados = [] }) {
  async function atribuirTecnico(idChamado) {
    const cookieJWT = getCookie('tokenJWT');
    try {
      const response = await fetch(
        `http://localhost:8080/criarchamado/${idChamado}`,
        {
          method: 'PUT',
          headers: {
            Authorization: 'Bearer ' + cookieJWT,
          },
        }
      );
      const data = response.json();
      console.log(data);

      if (response.ok) {
        alert('chamado atribuido com sucesso');
      } else {
        alert('Erro ao atribuir chamado');
      }
    } catch {
      alert('Erro ao enviar dados');
    }
  }

  return (
    <>
      <div className="container-fluid px-0">
        {chamados.map((item) => (
          <div className="card" style={{ width: '18rem' }} key={item.id}>
            <div className="card-body">
              <h5 className="card-title">{item.titulo}</h5>
              <p className="card-text">{item.patrimonio}</p>

              <button
                onClick={() => atribuirTecnico(item.id)}
                className="btn btn-primary"
              >
                Pegar chamado
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
