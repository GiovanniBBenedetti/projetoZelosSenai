'use client';

import { useEffect, useState } from 'react';
import Select from 'react-select';
import { getCookie } from 'cookies-next';
import './ModalEditar.css';

export default function ModalEditar({ chamado }) {
  const [mounted, setMounted] = useState(false);
  const [numeroPatrimonio, setNumeroPatrimonio] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo_id, setTipoId] = useState(null);
  const [tecnico_id, setTecnicoId] = useState('');
  const [chamadoId, setChamadoId] = useState('');

  const tipoOptions = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' }
  ];

  useEffect(() => {
    setMounted(true);
    if (chamado) {
      setNumeroPatrimonio(chamado.patrimonio || '');
      setTitulo(chamado.titulo || '');
      setDescricao(chamado.descricao || '');
      setTipoId(chamado.tipo_id ? { value: chamado.tipo_id, label: String(chamado.tipo_id) } : null);
      setTecnicoId(chamado.tecnico_id || '');
      setChamadoId(chamado.id || '');
    }
  }, [chamado]);

  if (!mounted) return null;

  const handleSubmit = async () => {
    const token = getCookie('token');
    const dadosNovos = {
      TITULO: titulo,
      DESCRICAO: descricao,
      TIPO_ID: tipo_id?.value || '',
      TECNICO_ID: tecnico_id || '',
    };

    try {
      const response = await fetch(`http://localhost:8080/chamado/uptade/${chamadoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(dadosNovos)
      });

      const data = await response.json();
      alert(data.mensagem)
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target.className.includes('modal-backdrop')) {
      const modalEl = document.getElementById('modalEditar');
      const modal = window.bootstrap.Modal.getInstance(modalEl);
      modal.hide();
    }
  };

  return (
    <div
      className="modal fade"
      id="modalEditar"
      tabIndex={-1}
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      onClick={handleBackdropClick}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title titulo-novo-medico">Alterar Patrimônio</h1>
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
                  disabled
                  className="form-control form-disabled rounded-5 rounded-start-0"
                  placeholder="Nº Patrimônio"
                  value={numeroPatrimonio}
                  onChange={(e) => setNumeroPatrimonio(e.target.value)}
                />
              </div>

              <div className="input-group mb-3 rounded-start-pill rounded-end-pill">
                <span className="input-group-text rounded-start-pill">
                  <i className="bi bi-type"></i>
                </span>
                <input
                  type="text"
                  className="form-control rounded-5 rounded-start-0"
                  placeholder="Titulo"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                />
              </div>

              <div className="input-group mb-3 rounded-start-pill rounded-end-pill">
                <span className="input-group-text rounded-start-pill">
                  <i className="bi bi-card-text"></i>
                </span>
                <input
                  type="text"
                  className="form-control rounded-5 rounded-start-0"
                  placeholder="Descricao"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </div>

              <div className="input-group mb-3 rounded-start-pill rounded-end-pill align-items-center">
                <span className="input-group-text rounded-start-pill">
                  <i className="bi bi-tools"></i>
                </span>
                <div className="flex-grow-1">
                  <Select
                    options={tipoOptions}
                    value={tipo_id}
                    onChange={(option) => setTipoId(option)}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        borderColor: state.isFocused ? "transparent" : "transparent",
                        boxShadow: state.isFocused ? "0 0 0 1px #b5000c" : "none", 
                        borderRadius: "18px",
                        "&:hover": {
                          borderColor: "transparent",
                        },
                      }),
                      menu: (base) => ({
                        ...base,
                        overflow: "hidden",
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isSelected
                          ? "#b5000c"
                          : state.isFocused
                            ? "#f5c4c7"
                            : "white",
                        color: state.isSelected ? "white" : "#333",
                        "&:hover": {
                          backgroundColor: "#f5c4c7",
                        },
                      }),
                    }}
                  />
                </div>

              </div>

              <div className="input-group mb-3 rounded-start-pill rounded-end-pill">
                <span className="input-group-text rounded-start-pill">
                  <i className="bi bi-person-bounding-box"></i>
                </span>
                <input
                  type="text"
                  className="form-control rounded-5 rounded-start-0"
                  placeholder="Tecnico Id"
                  value={tecnico_id}
                  onChange={(e) => setTecnicoId(e.target.value)}
                />
              </div>

              <button
                type="button"
                className="btn-modal"
                onClick={handleSubmit}
              >
                Alterar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}