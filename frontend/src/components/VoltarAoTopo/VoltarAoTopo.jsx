'use client';

import { useEffect, useState } from 'react';
import './VoltarAoTopo.css';

export default function VoltarAoTopo() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisivel(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const irParaTopo = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    visivel && (
      <>
        <button
          onClick={irParaTopo}
          className="btn-voltar-topo rounded-circle shadow"
        >
          <i className="bi bi-arrow-up-short fs-3 icon-btn-topo"></i>
        </button>
        <style>
          {`
          .btn-voltar-topo {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 999;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--vermelho);
          padding: 5px;
          color: var(--branco);
          }`}
        </style>
      </>
    )
  );
}
