'use client';

import { useEffect, useState } from 'react';
import BotaoNovo from '@/components/BotaoNovo/BotaoNovo';
import Select from 'react-select';
import './ModalCadastro.css';

// Opções de tipo de equipamento
const equipamentoOptions = [
  { value: 'Computador', label: 'Computador' },
  { value: 'Projetor', label: 'Projetor' },
  { value: 'Impressora', label: 'Impressora' },
  { value: 'Outro', label: 'Outro' }
];

// Opções de status
const statusOptions = [
  { value: 'Ativo', label: 'Ativo' },
  { value: 'Manutenção', label: 'Manutenção' },
  { value: 'Inativo', label: 'Inativo' }
];

export default function CadastroPatrimonio() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; 

  return (
    <>
      <style>
        {`
          .input-group {
            border: solid 1.5px #8e0009 !important;
          }
          .form-select {
            border: solid 1.5px #8e0009 !important;
          }
        `}
      </style>

      <BotaoNovo
        placeholder={'Cadastrar Novo Patrimônio'}
        data={'#modalNovoPatrimonio'}
      />

      <div
        className="modal fade"
        id="modalNovoPatrimonio"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1
                className="modal-title titulo-novo-medico"
                id="exampleModalLabel"
              >
                Cadastro de Patrimônio
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>

            <div className="modal-body">
              <div className="inputsCadastro">
               
                <div className="input-group mb-3 rounded-start-pill rounded-end-pill">
                  <span className="input-group-text rounded-start-pill">
                    <i className="bi bi-upc-scan"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control rounded-5 rounded-start-0"
                    placeholder="Nº Patrimônio"
                  />
                </div>

             
                <div className="input-group mb-3 rounded-start-pill rounded-end-pill">
                  <span className="input-group-text rounded-start-pill">
                    <i className="bi bi-door-open"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control rounded-5 rounded-start-0"
                    placeholder="Sala"
                  />
                </div>

                <div className="mb-3">
                  <Select
                    options={equipamentoOptions}
                    classNamePrefix="select-user"
                    placeholder="Tipo de Equipamento"
                  />
                </div>

             
                <div className="mb-3">
                  <Select
                    options={statusOptions}
                    classNamePrefix="select-user"
                    placeholder="Status"
                  />
                </div>

   
                <div className="input-group mb-3 rounded-start-pill rounded-end-pill">
                  <span className="input-group-text rounded-start-pill">
                    <i className="bi bi-calendar-event"></i>
                  </span>
                  <input
                    type="date"
                    className="form-control rounded-5 rounded-start-0"
                  />
                </div>

            
                <div className="input-group mb-3">
                  <span className="input-group-text">
                    <i className="bi bi-journal-text"></i>
                  </span>
                  <textarea
                    className="form-control"
                    placeholder="Observações"
                    rows={3}
                  />
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
