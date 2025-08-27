'use client';

import './dash.css';
import React, { useEffect, useState } from 'react';
import { CheckCircle, Clock, Wrench } from 'lucide-react';

export default function DashboardZeloPage() {
  const [chamadosConcluidos, setChamadosConcluidos] = useState([]);
  const [chamadosPendentes, setChamadosPendentes] = useState([]);
  const [chamadosEmAndamento, setChamadosEmAndamento] = useState([]);
  const [chamadosEnviados, setChamadosEnviados] = useState([]);

  useEffect(() => {
 
    fetch(`http://localhost:8080/chamado?status=concluido`)
      .then(res => res.json())
      .then(data => setChamadosConcluidos(data))
      .catch(err => console.error('Erro ao buscar chamados concluídos:', err));

    fetch(`http://localhost:8080/chamado?status=pendente`)
      .then(res => res.json())
      .then(data => setChamadosPendentes(data))
      .catch(err => console.error('Erro ao buscar chamados pendentes:', err));


    fetch(`http://localhost:8080/chamado?status=enviado`)
      .then(res => res.json())
      .then(data => setChamadosEnviados(data))
      .catch(err => console.error('Erro ao buscar chamados enviados:', err));
  }, []);

  return (
    <div className="container-fluid p-4 dashboard">

      <div className="row g-4 mb-4">
 
        <div className="col-md-4 col-12">
          <div className="card cardUltimosChamdos border-0 p-3 h-100">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="text-muted">Chamados Concluídos</h6>
              <CheckCircle className="text-success" size={28} />
            </div>
            <h3 className="fw-bold">{chamadosConcluidos.length}</h3>
          </div>
        </div>

        <div className="col-md-4 col-12">
          <div className="card cardUltimosChamdos border-0 p-3 h-100">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="text-muted">Chamados Pendentes</h6>
              <Clock className="text-warning" size={28} />
            </div>
            <h3 className="fw-bold">{chamadosPendentes.length}</h3>
          </div>
        </div>
        
    
        <div className="col-md-4 col-12">
          <div className="card cardUltimosChamdos border-0 p-3 h-100">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="text-muted">Chamados Em Andamento</h6>
              <Wrench className="text-info" size={28} />
            </div>
            <h3 className="fw-bold">{chamadosEnviados.length}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}