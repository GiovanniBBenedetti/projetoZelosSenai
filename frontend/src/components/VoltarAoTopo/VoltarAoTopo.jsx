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
      <button
        onClick={irParaTopo}
        className="btn-voltar-topo btn btn-danger rounded-circle shadow"
      >
        <i className="bi bi-arrow-up-short fs-3"></i>
      </button>
    )
  );
}
