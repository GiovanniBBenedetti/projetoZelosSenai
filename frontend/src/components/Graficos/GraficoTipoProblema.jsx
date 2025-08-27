'use client';

import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Title, Tooltip, Legend);

export default function GraficoTipoProblema() {
  const data = {
    labels: ['Manutenção', 'Apoio Técnico', 'Limpeza', 'Externo'],
    datasets: [{
      data: [30, 25, 15, 10], // Dados fictícios
      backgroundColor: [
        '#b5000c',
        '#ffbf00',
        '#8e0009',
        '#e30615',
      ],
      borderColor: [
        '#101820',
        '#101820',
        '#101820',
        '#101820',
      ],
      borderWidth: 2,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
            color: 'white',
        }
      },
      title: {
        display: false,
      },
    },
  };

  return <Doughnut data={data} options={options} />;
}