'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function GraficoChamadosPorTecnico() {
  const data = {
    labels: ['Técnico 1', 'Técnico 2', 'Técnico 3'],
    datasets: [{
      label: 'Chamados',
      data: [10, 15, 8], // Dados fictícios
      backgroundColor: '#b5000c',
    }],
  };

  const options = {
    indexAxis: 'y',
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
            ticks: {
                color: 'white',
            }
        },
        x: {
            ticks: {
                color: 'white',
            }
        }
    }
  };

  return <Bar data={data} options={options} />;
}