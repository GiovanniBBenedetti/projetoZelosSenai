import './Footer.css';

export default function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="section-1">
          <img src="/logotipos/logosJuntasBrancas.png" className="img-footer" />
        </div>
        <div className="section-2">
          <ul>
            <a href="/user">
              <li>Perfil</li>
            </a>
            <a href="/user">
              <li>Chamados</li>
            </a>
            <a href="/user">
              <li>Dashboard</li>
            </a>
            <a href="/user">
              <li>Ajuda</li>
            </a>
          </ul>
        </div>
        <div className="section-3">
          <p>
            Desenvolvido para otimizar a gestão de chamados e facilitar a
            comunicação entre alunos e administração. Todos os direitos
            reservados.
          </p>
          <p>&copy; 2025 SENAI | ZELOS </p>
        </div>
      </footer>
    </>
  );
}
