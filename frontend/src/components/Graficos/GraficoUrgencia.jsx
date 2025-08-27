'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function GraficoUrgencia() {
  const data = {
    labels: ['Baixa', 'Mínima', 'Prioritária', 'Imediata'],
    datasets: [{
      label: 'Chamados por Prioridade',
      data: [15, 20, 25, 10], // Dados fictícios
      backgroundColor: [
        '#008000',
        '#ffbf00',
        '#e30615',
        '#8e0009',
      ],
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
}