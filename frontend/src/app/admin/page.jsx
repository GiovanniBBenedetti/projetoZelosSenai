'use client';

import './dash.css';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import CardTecnicoDestaque from '@/components/CardTecnicoDestaque/CardTecnicoDestaque';
import GraficoUrgencia from '@/components/Graficos/GraficoUrgencia';
import GraficoTipoProblema from '@/components/Graficos/GraficoTipoProblema';
import GraficoChamadosPorTecnico from '@/components/Graficos/GraficoChamadosPorTecnico';
import GraficoTotalChamados from '@/components/Graficos/GraficoTotalChamados';
import { getCookie } from 'cookies-next';


export default function DashboardZeloPage() {
    const [patrimonios, setPatrimonios] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chamadosAtrasados] = useState(10);
    const [chamadosTotais] = useState(30);
    const [chamadosAbertos] = useState(21);
    const [chamadosNaoIniciados] = useState(9);
    const [tecnicos] = useState([
        { nome: 'Arthur Buscalino', departamento: 'Técnico', chamadosResolvidos: 40, email: 'arthur.b@email.com', iniciais: 'AB' },
        { nome: 'Giovanna Freitas', departamento: 'Técnico', chamadosResolvidos: 35, email: 'giovanna.f@email.com', iniciais: 'GF' },
        { nome: 'João Pedro', departamento: 'Técnico', chamadosResolvidos: 32, email: 'joao.p@email.com', iniciais: 'JP' },
    ]);


    useEffect(() => {
        const fetchUsuariosAtivos = async () => {
            setLoading(true);
            try {
                const token = getCookie('token'); // pega o token do cookie
                const res = await fetch('http://localhost:8080/usuarios?status=ativo', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!res.ok) throw new Error('Erro ao buscar usuários');

                const data = await res.json();
                setUsuarios(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        const fetchPatrimoniosAtivos = async () => {
            setLoading(true);
            try {
                const token = getCookie('token');
                const res = await fetch('http://localhost:8080/patrimonios?status=ativo', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!res.ok) throw new Error('Erro ao buscar patrimonios');

                const data = await res.json();
                setPatrimonios(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };


        fetchPatrimoniosAtivos();
        fetchUsuariosAtivos();
    }, []);


    useEffect(() => {



    }, []);


    if (loading) {
        return <p>Carregando...</p>;
    }

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
                            <p>{usuarios.length} Usuários</p>
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

            <div className="row mt-3">
                <div className="col-md-12">
                    <div className="chart-card">
                        <h3 className="chart-title">Chamados por técnicos</h3>
                        <div className="chart-wrapper">
                            <GraficoChamadosPorTecnico />
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

            <div className="row mt-5">
                <div className="col-md-12">
                    <div className="chart-card">
                        <h3 className="chart-title">total de chamados por semana</h3>
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
                        <div className="row mt-4">
                            {tecnicos.map((tecnico, index) => (
                                <div key={index} className="col-md-4 mb-4">
                                    <CardTecnicoDestaque
                                        nome={tecnico.nome}
                                        departamento={tecnico.departamento}
                                        chamadosResolvidos={tecnico.chamadosResolvidos}
                                        email={tecnico.email}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
