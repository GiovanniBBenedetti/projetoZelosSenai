'use client';

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { getCookie } from 'cookies-next';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function GraficoUrgencia() {
  const [dataUrgencia, setDataUrgencia] = useState([0, 0, 0, 0]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDadosUrgencia = async () => {
      try {
        const token = getCookie('token');
        const prioridades = [
          { key: '1', label: 'Preventiva' },
          { key: '2', label: 'Sem Urgência' },
          { key: '3', label: 'Prioritaria' },
          { key: '4', label: 'Imediata' },
        ];

        const resultados = [];
        for (const p of prioridades) {
          const res = await fetch(`http://localhost:8080/dashboard/grauPrioridade?grauPrioridade=${p.key}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error(`Erro ao buscar prioridade: ${p.key}`);
          const dados = await res.json();
          resultados.push(dados.length || 0);
        }

        setDataUrgencia(resultados);
      } catch (error) {
        console.error('Erro ao buscar dados de urgência:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDadosUrgencia();
  }, []);

  const data = {
    labels: ['Baixa', 'Mínima', 'Prioritária', 'Imediata'],
    datasets: [
      {
        label: 'Chamados por Prioridade',
        data: dataUrgencia,
        backgroundColor: ['#417bd5', '#4cc78b', '#ff9d59', '#d83d65'],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  if (loading) {
    return <p>Carregando gráfico...</p>;
  }

  return <Bar data={data} options={options} />;
}
