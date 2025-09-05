'use client';

import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { getCookie } from 'cookies-next';

ChartJS.register(ArcElement, Title, Tooltip, Legend);

export default function GraficoTipoProblema() {
  const [dataTipos, setDataTipos] = useState([0, 0, 0, 0]);
  const [loading, setLoading] = useState(true);

  const tipos = [
    { key: 1, label: 'Externo' },
    { key: 2, label: 'Manutenção' },
    { key: 3, label: 'Apoio Técnico' },
    { key: 4, label: 'Limpeza' },
  ];

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const token = getCookie('token');
        
        const resultados = [];
        for (const t of tipos) {
          const res = await fetch(`http://localhost:8080/dashboard/tipo?tipo=${t.key}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error(`Erro ao buscar tipo: ${t.key}`);
          const dados = await res.json();
          resultados.push(dados.length || 0);
        }

        setDataTipos(resultados);
      } catch (error) {
        console.error('Erro ao buscar dados de tipos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTipos();
  }, []);

  const data = {
    labels: tipos.map(t => t.label),
    datasets: [
      {
        data: dataTipos,
        backgroundColor: ['#b5000c', '#ffbf00', '#8e0009', '#e30615'],
        borderColor: ['#101820', '#101820', '#101820', '#101820'],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'black',
        },
      },
      title: {
        display: true,

        color: 'black',
        font: {
          size: 18,
          weight: 'bold',
        },
      },
    },
  };

  if (loading) {
    return <p>Carregando gráfico...</p>;
  }

  return <Doughnut data={data} options={options} />;
}
