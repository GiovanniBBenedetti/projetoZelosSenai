'use client';

import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function GraficoTotalChamados() {
  const data = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    datasets: [{
      label: 'Chamados Abertos',
      data: [50, 45, 60, 55, 70, 65, 80, 75, 90, 85, 100, 95], // Dados fictícios
      borderColor: '#e30615',
      backgroundColor: 'rgba(227, 6, 21, 0.5)',
      tension: 0.4,
      fill: false,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
            color: 'white',
        }
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

  return <Line data={data} options={options} />;
}