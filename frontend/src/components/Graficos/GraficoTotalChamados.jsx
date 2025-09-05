'use client';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { getCookie } from 'cookies-next';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function GraficoTotalChamados() {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    async function fetchData() {
      try {
        const token = getCookie('token'); 

        const res = await fetch("http://localhost:8080/dashboard/semanal", {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        const data = await res.json();

        setChartData({
          labels: data.labels,
          datasets: [
            {
              label: "Chamados Enviados",
              data: data.datasets.enviados,
              borderColor: "#e30615",
              backgroundColor: "rgba(227, 6, 21, 0.5)",
              tension: 0.4
            },
            {
              label: "Chamados Em Andamento",
              data: data.datasets.andamento,
              borderColor: "#f0ad4e",
              backgroundColor: "rgba(240, 173, 78, 0.5)",
              tension: 0.4
            },
            {
              label: "Chamados Concluídos",
              data: data.datasets.concluidos,
              borderColor: "#007bff",
              backgroundColor: "rgba(0, 123, 255, 0.5)",
              tension: 0.4
            },
            
          ]
        });
      } catch (error) {
        console.error("Erro ao buscar dados do gráfico:", error);
      }
    }

    fetchData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: 'black' } },
      title: { display: false },
    },
    scales: {
      y: { ticks: { color: 'black' } },
      x: { ticks: { color: 'black' } },
    },
  };

  return <Line data={chartData} options={options} />;
}
