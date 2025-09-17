'use client';

import React, { useEffect, useState } from 'react';
import './CardTecnicoDestaque.css';
import Link from 'next/link';
import { getCookie } from 'cookies-next';
import Loader from '@/components/Loader/Loader';

export default function CardTecnicoDestaque() {
    const [tecnicos, setTecnicos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTecnicos = async () => {
            try {
                const token = getCookie('token');
                const res = await fetch('http://localhost:8080/dashboard/tecnicosDestaque', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) throw new Error('Erro ao buscar técnicos em destaque');
                const data = await res.json();
                setTecnicos(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchTecnicos();
    }, []);

    if (loading) {
        return <Loader />;
    }

    if (tecnicos.length === 0) {
        return <p>Nenhum técnico em destaque encontrado</p>;
    }

    return (
        <div className="row mt-4">
            {tecnicos.map((tecnico, index) => {
                const partes = tecnico.nome.trim().split(' ');
                const iniciais =
                    (partes[0]?.charAt(0).toUpperCase() || '') +
                    (partes[partes.length - 1]?.charAt(0).toUpperCase() || '');

                return (
                    <div key={index} className="col-md-4 mb-4">
                        <div className="card-tecnico-destaque">
                            <div className="tecnico-header">
                                <div className="tecnico-avatar">
                                    {tecnico.foto ? (
                                        <img
                                            src={`http://localhost:8080${tecnico.foto}`}
                                            alt={`Foto de ${tecnico.nome}`}
                                            className="avatar-img img-fluid"
                                        />
                                    ) : (
                                        <p>{iniciais}</p>
                                    )}
                                </div>
                                <div className="tecnico-info">
                                    <h4>{tecnico.nome}</h4>
                                    <span>{tecnico.departamento}</span>
                                </div>
                            </div>
                            <div className="tecnico-body">
                                <p>Chamados resolvidos</p>
                                <h5>{tecnico.chamados_resolvidos}</h5>
                                <p className='text-truncate'>Email: {tecnico.email}</p>
                            </div>
                            <div className="tecnico-footer">
                                <Link href={`mailto:${tecnico.email}`} className="btn-email">
                                    <i className="bi bi-envelope-fill"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
