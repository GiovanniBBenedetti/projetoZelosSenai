'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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

// Registra os componentes necessários do Chart.js
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
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);

  // Dados Fictícios para os gráficos
  const [grafico1Data, setGrafico1Data] = useState({
    labels: [],
    datasets: [],
  });
  const [grafico2Data, setGrafico2Data] = useState({
    labels: [],
    datasets: [],
  });
  const [graficoPizzaData, setGraficoPizzaData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    // Simulação de chamada ao backend com dados fictícios
    // Você pode substituir esta parte pela sua chamada real à API
    // connectBack.get('/dashboard').then(res => setDashboardData(res.data));

    const mockDashboardData = {
      emAnalise: 17,
      sendoRealizada: 21,
      realizada: 32,
    };
    setDashboardData(mockDashboardData);

    const mockGrafico1Data = {
      labels: ['Item 1', 'Item 2', 'Item 3'],
      datasets: [
        {
          label: 'Série 1',
          data: [3, 8, 14],
          backgroundColor: '#8B0000',
        },
        {
          label: 'Série 2',
          data: [6, 11, 18],
          backgroundColor: '#B22222',
        },
      ],
    };
    setGrafico1Data(mockGrafico1Data);

    const mockGrafico2Data = {
      labels: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'],
      datasets: [
        {
          label: 'Gráfico 2',
          data: [18, 25, 22, 35, 38],
          borderColor: '#B22222',
          backgroundColor: '#B22222',
          tension: 0.3,
        },
      ],
    };
    setGrafico2Data(mockGrafico2Data);

    const mockGraficoPizzaData = {
      labels: ['Item 1', 'Item 2', 'Item 3'],
      datasets: [
        {
          data: [62.5, 25, 17.5],
          backgroundColor: ['#B22222', '#8B0000', '#FF4500'],
          borderColor: '#fff',
        },
      ],
    };
    setGraficoPizzaData(mockGraficoPizzaData);
  }, []);

  // Função para gerar e baixar o PDF
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

  // Função para gerar e baixar o SCV (CSV)
  const handleDownloadSCV = () => {
    // Dados de exemplo para o CSV. Você deve usar os dados do seu estado.
    const headers = ['Metrica', 'Valor'];
    const metrics = [
      ['Em Analise', dashboardData.emAnalise],
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

  if (!dashboardData) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border text-danger" role="status"></div>
      </div>
    );
  }

  return (
    <>
      <style type="text/css">
        {`
          .dashboard {
            background-color: var(--branco); !important;
            color: var(--vermelho); !important;
            margin-left: 0 !important;
          };
        `}
      </style>
      <div
        id="dashboard-content"
        className="p-4 bg-light"
        style={{ minHeight: '100vh' }}
      >
        {/* Seção do Gráfico de Pizza */}
        <div className="row mb-5 align-items-center">
          <div className="col-md-6 text-center">
            <div className="w-75 mx-auto">
              <Pie data={graficoPizzaData} />
            </div>
          </div>
          <div className="col-md-6">
            <h1 className="text-danger">Acompanhe seu gráfico aqui</h1>
            <p className="text-muted">
              Vou tentar falar algo, quero que isso não fique vazio, então vou
              encher linguiça.
            </p>
          </div>
        </div>

        {/* Seção de Gráficos de Barras e Linha */}
        <h1 className="text-center mb-4 text-danger">Alguma coisa Aqui</h1>
        <p className="text-center mb-5 text-muted">
          Vou tentar falar algo, quero que isso não fique vazio, então vou
          encher linguiça.
        </p>

        <div className="row mb-5">
          <div className="col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title text-danger">Gráfico 1</h5>
                <Bar data={grafico1Data} />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title text-danger">Gráfico 2</h5>
                <Line data={grafico2Data} />
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-center mb-4 text-danger">Total de Chamados</h1>
        <p className="text-center mb-5 text-muted">
          Você pode acompanhar a quantidade de chamados em cada etapa e gerar
          relatórios.
        </p>
        {/* Seção de Métricas (Cards Circulares) */}
        <div className="row justify-content-center mb-5">
          <div className="col-md-4 text-center">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2"
              style={{
                width: '150px',
                height: '150px',
                backgroundColor: '#B22222',
                color: 'white',
              }}
            >
              <h2 className="fw-bold">{dashboardData.emAnalise}</h2>
            </div>
            <p className="text-uppercase fw-bold">Em Análise</p>
          </div>
          <div className="col-md-4 text-center">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2"
              style={{
                width: '150px',
                height: '150px',
                backgroundColor: '#B22222',
                color: 'white',
              }}
            >
              <h2 className="fw-bold">{dashboardData.sendoRealizada}</h2>
            </div>
            <p className="text-uppercase fw-bold">Sendo Realizada</p>
          </div>
          <div className="col-md-4 text-center">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2"
              style={{
                width: '150px',
                height: '150px',
                backgroundColor: '#B22222',
                color: 'white',
              }}
            >
              <h2 className="fw-bold">{dashboardData.realizada}</h2>
            </div>
            <p className="text-uppercase fw-bold">Realizada</p>
          </div>
        </div>

        {/* Seção de Botões */}
        <div className="text-center">
          <button
            onClick={handleDownloadPDF}
            className="btn btn-danger btn-lg me-3"
          >
            Criar PDF
          </button>
          <button onClick={handleDownloadSCV} className="btn btn-danger btn-lg">
            Criar SCV
          </button>
        </div>
      </div>
    </>
  );
}
