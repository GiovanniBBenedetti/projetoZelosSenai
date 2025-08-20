'use client';

import React, { useEffect, useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  LineElement,
  PointElement,
} from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Loader from '@/components/Loader/Loader';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  LineElement,
  PointElement
);

export default function DashboardZeloPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [graficoPizzaData, setGraficoPizzaData] = useState({ labels: [], datasets: [] });
  const [graficoBarrasData, setGraficoBarrasData] = useState({ labels: [], datasets: [] });
  const [graficoLinhaData, setGraficoLinhaData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    // 🔹 Dados fictícios (sem backend)
    const mockDashboardData = {
      emAnalise: 5,
      sendoRealizada: 12,
      realizada: 20,
    };

    // Chamados mais antigos (Pizza)
    const mockPizza = {
      labels: ['João', 'Maria', 'Pedro', 'Ana', 'Lucas', 'Carla'],
      datasets: [
        {
          data: [10, 8, 7, 5, 3, 2],
          backgroundColor: ['#B22222', '#8B0000', '#FF4500', '#CD5C5C', '#A52A2A', '#DC143C'],
        },
      ],
    };

    // Status por mês (Barras)
    const mockBarras = {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
      datasets: [
        {
          label: 'Não Iniciado',
          data: [5, 3, 6, 2, 4],
          backgroundColor: '#8B0000',
        },
        {
          label: 'Em Andamento',
          data: [3, 6, 4, 5, 7],
          backgroundColor: '#B22222',
        },
        {
          label: 'Concluído',
          data: [2, 4, 5, 3, 6],
          backgroundColor: '#FF6347',
        },
      ],
    };

    // Chamados últimos 5 dias (Linha)
    const mockLinha = {
      labels: ['15/08', '16/08', '17/08', '18/08', '19/08'],
      datasets: [
        {
          label: 'Chamados Abertos',
          data: [2, 4, 6, 3, 5],
          borderColor: '#B22222',
          backgroundColor: '#B22222',
          tension: 0.3,
        },
      ],
    };

    setDashboardData(mockDashboardData);
    setGraficoPizzaData(mockPizza);
    setGraficoBarrasData(mockBarras);
    setGraficoLinhaData(mockLinha);
  }, []);

  const handleDownloadPDF = () => {
    const input = document.getElementById('dashboard-content');
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('zelo-dashboard.pdf');
    });
  };

  const handleDownloadCSV = () => {
    const headers = ['Métrica', 'Valor'];
    const metrics = [
      ['Em Análise', dashboardData.emAnalise],
      ['Sendo Realizada', dashboardData.sendoRealizada],
      ['Realizada', dashboardData.realizada],
    ];
    let csvContent =
      'data:text/csv;charset=utf-8,' +
      headers.join(';') +
      '\n' +
      metrics.map((e) => e.join(';')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'zelo-dashboard.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!dashboardData) return <Loader />;

  return (
    <>
    <div className="body-content">
    <div id="dashboard-content" className="p-4 bg-light" style={{ minHeight: '100vh' }}>
      {/* Pizza */}
      <div className="row mb-5 align-items-center">
        <div className="col-md-6 text-center">
          <Pie data={graficoPizzaData} />
        </div>
        <div className="col-md-6">
          <h2 className="text-danger">Chamados mais antigos atribuídos</h2>
          <p className="text-muted">Top 6 chamados com mais tempo sem conclusão</p>
        </div>
      </div>

      {/* Barras e Linha */}
      <div className="row mb-5">
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title text-danger">Status por mês</h5>
              <Bar data={graficoBarrasData} />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title text-danger">Chamados últimos 5 dias</h5>
              <Line data={graficoLinhaData} />
            </div>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="row justify-content-center mb-5">
        {[
          { label: 'Em Análise', value: dashboardData.emAnalise },
          { label: 'Sendo Realizada', value: dashboardData.sendoRealizada },
          { label: 'Realizada', value: dashboardData.realizada },
        ].map((item, i) => (
          <div key={i} className="col-md-4 text-center">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2"
              style={{
                width: '150px',
                height: '150px',
                backgroundColor: '#B22222',
                color: 'white',
              }}
            >
              <h2 className="fw-bold">{item.value}</h2>
            </div>
            <p className="text-uppercase fw-bold">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Botões */}
      <div className="text-center">
        <button onClick={handleDownloadPDF} className="btn btn-danger btn-lg me-3">
          Criar PDF
        </button>
        <button onClick={handleDownloadCSV} className="btn btn-danger btn-lg">
          Criar CSV
        </button>
      </div>
    </div>
    </div>
    </>
  );
}
