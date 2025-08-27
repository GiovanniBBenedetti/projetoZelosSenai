'use client';

import React from 'react';
import './CardTecnicoDestaque.css';
import Link from 'next/link';

export default function CardTecnicoDestaque({ nome, departamento, chamadosResolvidos, email }) {
    const partes = nome.trim().split(' ');
    const iniciais = (partes[0]?.charAt(0).toUpperCase() || '') + (partes[partes.length - 1]?.charAt(0).toUpperCase() || '');

    return (
        <div className="card-tecnico-destaque">
            <div className="tecnico-header">
                <div className="tecnico-avatar">
                    <p>{iniciais}</p>
                </div>
                <div className="tecnico-info">
                    <h4>{nome}</h4>
                    <span>{departamento}</span>
                </div>
            </div>
            <div className="tecnico-body">
                <p>Chamados resolvidos</p>
                <h5>{chamadosResolvidos}</h5>
                <p>Email: {email}</p>
            </div>
            <div className="tecnico-footer">
                <Link href={`mailto:${email}`} className="btn-email">
                    <i className="bi bi-envelope-fill"></i>
                </Link>
            </div>
        </div>
    );
}