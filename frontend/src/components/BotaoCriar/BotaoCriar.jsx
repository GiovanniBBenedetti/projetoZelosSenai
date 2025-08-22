import React from 'react';

const Button = ({ funcao }) => {
  return (
    <>
      <button onClick={funcao}>
        <i className="bi bi-ticket-fill"></i>
        <span>Enviar Chamado</span>
      </button>

      <style jsx>{`
        button {
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: inherit;
          cursor: pointer;
          font-weight: 500;
          font-size: 17px;
          padding: 0.5em 0.5em;
          color: white;
          background: linear-gradient(
            to right,
            var(--vermelho),
            var(--vermelhoMedio),
            var(--vermelhoEscuro)
          );
          border: none;
          letter-spacing: 0.05em;
          border-radius: 20px;
          width: 100%;
        }

        button i {
          margin-right: 7px;
          font-size: 1.2rem;
          transform: rotate(0deg);
          transition: transform 0.5s cubic-bezier(0.76, 0, 0.24, 1);
        }

        button span {
          transition: transform 0.5s cubic-bezier(0.76, 0, 0.24, 1);
        }

        button:hover i {
          transform: translateX(5px) rotate(30deg);
        }

        button:hover span {
          transform: translateX(7px);
        }
      `}</style>
    </>
  );
};

export default Button;
