'use client';

import { useEffect, useState } from 'react';
import BotaoNovo from '@/components/BotaoNovo/BotaoNovo';
import Select from 'react-select';
import { getCookie } from 'cookies-next';
import './ModalCadastro.css';

const equipamentoOptions = [
  { value: 'Computador', label: 'Computador' },
  { value: 'Periférico', label: 'Periférico' },
  { value: 'Microcomputador', label: 'Microcomputador' },
  { value: 'Monitor', label: 'Monitor' },
  { value: 'Educacional', label: 'Educacional' },
  { value: 'Desktop', label: 'Desktop' },
  { value: 'Móveis', label: 'Móveis' },
  { value: 'Climatização', label: 'Climatização' },
  { value: 'Aberturas', label: 'Aberturas' },
  { value: 'Botânica', label: 'Botânica' },
  { value: 'Projetor', label: 'Projetor' },
  { value: 'Impressora', label: 'Impressora' },
  { value: 'Outro', label: 'Outro' }
];


const statusOptions = [
  { value: 'Ativo', label: 'Ativo' },
  { value: 'Inativo', label: 'Inativo' }
];

export default function CadastroPatrimonio() {
  const [mounted, setMounted] = useState(false);

  // Estados dos inputs
  const [numeroPatrimonio, setNumeroPatrimonio] = useState('');
  const [equipamento, setEquipamento] = useState('');
  const [sala, setSala] = useState('');
  const [tipoEquipamento, setTipoEquipamento] = useState(null);
  const [status, setStatus] = useState(null);
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSubmit = async () => {
    const token = getCookie('token');

    const payload = {
      PATRIMONIO: numeroPatrimonio,
      EQUIPAMENTO: equipamento,
      SALA: sala,
      TIPO: tipoEquipamento?.value || '',
      STATUS: status?.value || '',
      OBSERVACAO: observacoes
    };

    try {
      const response = await fetch('http://localhost:8080/patrimonios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Erro ao cadastrar patrimônio');

      alert('Patrimônio cadastrado com sucesso!');

      // Recarrega a página
      window.location.reload();

    } catch (error) {
      console.error(error);
      alert('Erro ao cadastrar patrimônio.');
    }
  };

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
              <h1 className="modal-title titulo-novo-medico" id="exampleModalLabel">
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
                    value={numeroPatrimonio}
                    onChange={(e) => setNumeroPatrimonio(e.target.value)}
                  />
                </div>

                <div className="input-group mb-3 rounded-start-pill rounded-end-pill">
                  <span className="input-group-text rounded-start-pill">
                    <i className="bi bi-hdd"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control rounded-5 rounded-start-0"
                    placeholder="Equipamento"
                    value={equipamento}
                    onChange={(e) => setEquipamento(e.target.value)}
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
                    value={sala}
                    onChange={(e) => setSala(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <Select
                    options={equipamentoOptions}
                    classNamePrefix="select-user"
                    placeholder="Tipo de Equipamento"
                    value={tipoEquipamento}
                    onChange={setTipoEquipamento}
                  />
                </div>

                <div className="mb-3">
                  <Select
                    options={statusOptions}
                    classNamePrefix="select-user"
                    placeholder="Status"
                    value={status}
                    onChange={setStatus}
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
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  className="btn-modal"
                  onClick={handleSubmit}
                >
                  Cadastrar
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
