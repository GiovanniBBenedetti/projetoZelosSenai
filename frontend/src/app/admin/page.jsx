'use client';

import './dash.css';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Loader from '@/components/Loader/Loader';
import CardTecnicoDestaque from '@/components/CardTecnicoDestaque/CardTecnicoDestaque';
import GraficoUrgencia from '@/components/Graficos/GraficoUrgencia';
import GraficoTipoProblema from '@/components/Graficos/GraficoTipoProblema';
import GraficoTotalChamados from '@/components/Graficos/GraficoTotalChamados';
import { getCookie } from 'cookies-next';

import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function DashboardZeloPage() {
    const [patrimonios, setPatrimonios] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [chamadosAtrasados, setChamadosAtrasados] = useState(0);
    const [tecnicos, setTecnicos] = useState([]);
    const [loading, setLoading] = useState(true);

    const [chamadosTotais, setChamadosTotais] = useState(0);
    const [chamadosAbertos, setChamadosAbertos] = useState(0);
    const [chamadosNaoIniciados, setChamadosNaoIniciados] = useState(0);

    const [porcentagemAbertos, setPorcentagemAbertos] = useState(0);
    const [porcentagemNaoIniciados, setPorcentagemNaoIniciados] = useState(0);

    useEffect(() => {
        const token = getCookie('token');

        const fetchChamadosTotais = async () => {
            const res = await fetch('http://localhost:8080/dashboard/chamadosParams', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Erro ao buscar chamados totais');
            const data = await res.json();
            setChamadosTotais(data.length || 0);
        };

        const fetchChamadosAbertos = async () => {
            const res = await fetch('http://localhost:8080/dashboard/chamadosParams?status=em andamento', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Erro ao buscar chamados abertos');
            const data = await res.json();
            setChamadosAbertos(data.length || 0);
        };

        const fetchChamadosNaoIniciados = async () => {
            const res = await fetch('http://localhost:8080/dashboard/chamadosParams?status=enviado', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Erro ao buscar chamados não iniciados');
            const data = await res.json();
            setChamadosNaoIniciados(data.length || 0);
        };

        Promise.all([
            fetchChamadosTotais(),
            fetchChamadosAbertos(),
            fetchChamadosNaoIniciados(),
        ]).catch(err => console.error(err));

    }, []);

    useEffect(() => {
        const totalAtivos = chamadosAbertos + chamadosNaoIniciados;
        if (totalAtivos > 0) {
            const percAbertos = Math.round((chamadosAbertos / totalAtivos) * 100);
            const percNaoIniciados = Math.round((chamadosNaoIniciados / totalAtivos) * 100);
            setPorcentagemAbertos(percAbertos);
            setPorcentagemNaoIniciados(percNaoIniciados);
        } else {
            setPorcentagemAbertos(0);
            setPorcentagemNaoIniciados(0);
        }
    }, [chamadosAbertos, chamadosNaoIniciados]);

    useEffect(() => {
        const token = getCookie('token');

        const fetchUsuariosAtivos = async () => {
            const res = await fetch('http://localhost:8080/dashboard/usuarios?status=ativo', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Erro ao buscar usuários');
            setUsuarios(await res.json());
        };

        const fetchPatrimoniosAtivos = async () => {
            const res = await fetch('http://localhost:8080/dashboard/patrimonios?status=ativo', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Erro ao buscar patrimonios');
            setPatrimonios(await res.json());
        };

        const fetchChamadosAtrasados = async () => {
            const res = await fetch('http://localhost:8080/dashboard/atrasados', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Erro ao buscar chamados atrasados');
            const data = await res.json();
            setChamadosAtrasados(data.length || 0);
        };

        const fetchTecnicosDestaque = async () => {
            const res = await fetch('http://localhost:8080/dashboard/tecnicosDestaque', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Erro ao buscar técnicos em destaque');
            setTecnicos(await res.json());
        };

        setLoading(true);
        Promise.all([
            fetchUsuariosAtivos(),
            fetchPatrimoniosAtivos(),
            fetchChamadosAtrasados(),
            fetchTecnicosDestaque(),
        ])
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <Loader />;
    }

    // Exportar PDF como print da página
    const exportPDF = () => {
        const input = document.querySelector(".dashboard-admin");
        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save("dashboard-zelos.pdf");
        });
    };

    // Exportar CSV (Excel)
    const exportCSV = () => {
        const data = [
            { Nome: "Patrimônios Ativos", Valor: patrimonios.length },
            { Nome: "Usuários Ativos", Valor: usuarios.length },
            { Nome: "Chamados em Atraso", Valor: chamadosAtrasados },
            { Nome: "Chamados Totais", Valor: chamadosTotais },
            { Nome: "Chamados em Aberto", Valor: chamadosAbertos },
            { Nome: "Chamados Não Iniciados", Valor: chamadosNaoIniciados },
        ];

        const ws = utils.json_to_sheet(data);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "Dashboard");
        writeFile(wb, "dashboard-zelos.xlsx");
    };

    return (
        <div className="container-fluid dashboard-admin">
            <div className="row dashboard-header">
                <div className="col-md-4 mt-4 card-information-col">
                    <Link href="/admin/patrimonios" className="card-information">
                        <div className="text-content">
                            <p>{patrimonios.length} Patrimonios</p>
                            <span>Em utilização</span>
                        </div>
                        <i className="bi bi-caret-right-fill"></i>
                    </Link>
                </div>
                <div className="col-md-4 mt-4 card-information-col">
                    <Link href="/admin/usuarios" className="card-information">
                        <div className="text-content">
                            <p>{usuarios.length} Pessoas</p>
                            <span>Com status ativo</span>
                        </div>
                        <i className="bi bi-caret-right-fill"></i>
                    </Link>
                </div>
                <div className="col-md-4 mt-4 card-information-col">
                    <div className="card-information">
                        <div className="text-content">
                            <p>{chamadosAtrasados} Chamados</p>
                            <span>Abertos em <b>Atraso</b></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gráficos */}
            <div className="row mt-5">
                <div className="col-md-6 mb-4">
                    <div className="chart-card">
                        <h3 className="chart-title">Gráfico de Urgência</h3>
                        <div className="chart-wrapper">
                            <GraficoUrgencia />
                        </div>
                    </div>
                </div>
                <div className="col-md-6 mb-4">
                    <div className="chart-card">
                        <h3 className="chart-title">Chamados por Tipo de Problema</h3>
                        <div className="chart-wrapper">
                            <GraficoTipoProblema />
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mt-5">
                <div className="col-md-4 mb-4">
                    <div className="info-box info-box-1">
                        <h3>{chamadosTotais}</h3>
                        <p>Número de chamados</p>
                        <span>3% desde semana passada</span>
                    </div>
                </div>
                <div className="col-md-4 mb-4">
                    <div className="info-box info-box-2">
                        <h3>{chamadosAbertos}</h3>
                        <p>Chamados em aberto</p>
                        <span>-10% desde semana passada</span>
                    </div>
                </div>
                <div className="col-md-4 mb-4">
                    <div className="info-box info-box-3">
                        <h3>{chamadosNaoIniciados}</h3>
                        <p>Chamados não iniciados</p>
                        <span>3% desde semana passada</span>
                    </div>
                </div>
            </div>

            <div className="row dash-progress-bar mt-2 mb-2">
                <div className="dash-porcent d-flex gap-5">
                    <p><span>{porcentagemAbertos}%</span> dos chamados estão aberto</p>
                    <p><span>{porcentagemNaoIniciados}%</span> dos chamados ainda não foram iniciados</p>
                </div>
                <div className="dash-barra">
                    <div className="abertos" style={{ width: `${porcentagemAbertos}%` }}></div>
                </div>
            </div>

            <div className="row mt-5">
                <div className="col-md-12">
                    <div className="chart-card">
                        <h3 className="chart-title">Total de chamados por semana</h3>
                        <div className="chart-wrapper">
                            <GraficoTotalChamados />
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mt-5">
                <div className="col-md-12">
                    <div className="tecnicos-destaque-container">
                        <h3 className="section-title">Técnicos em Destaque</h3>
                        <p className="section-subtitle">Os 3 técnicos com o maior número de chamados resolvidos</p>
                        <CardTecnicoDestaque />
                    </div>
                </div>
            </div>

            {/* Botões de Exportação */}
            <div className="row mt-5 mb-5">
                <div className="col-md-12 d-flex gap-3 justify-content-center">
                    <button className="btn btn-danger" onClick={exportPDF}>
                        <i className="bi bi-file-earmark-pdf"></i> Exportar PDF
                    </button>
                    <button className="btn btn-success" onClick={exportCSV}>
                        <i className="bi bi-file-earmark-excel"></i> Exportar CSV
                    </button>
                </div>
            </div>
        </div>
    );
}
