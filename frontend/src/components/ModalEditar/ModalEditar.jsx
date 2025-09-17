'use client';

import { useEffect, useState } from 'react';
import Select from 'react-select';
import { getCookie } from 'cookies-next';
import Toast from '@/components/Toast/Toast';
import './ModalEditar.css';

export default function ModalEditar({ chamado }) {
  const [mounted, setMounted] = useState(false);
  const [numeroPatrimonio, setNumeroPatrimonio] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo_id, setTipoId] = useState(null);
  const [tecnico_id, setTecnicoId] = useState('');
  const [chamadoId, setChamadoId] = useState('');
  const [tecnicoInicialVazio, setTecnicoInicialVazio] = useState(false);
  const [erro, setErro] = useState('');
  const [tecnicosArea, setTecnicosArea] = useState([]);

  const tipoOptions = [
    { value: "Externo", label: 'Externo' },
    { value: "Manutenção", label: 'Manutenção' },
    { value: "Apoio Tecnico", label: 'Apoio Técnico' },
    { value: "Limpeza", label: 'Limpeza' }
  ];

  useEffect(() => {
    setMounted(true);
    if (chamado) {
      console.log(chamado)
      setNumeroPatrimonio(chamado.patrimonio || '');
      setTitulo(chamado.titulo || '');
      setDescricao(chamado.descricao || '');
      const option = tipoOptions.find(opt => opt.value === chamado.tipo_nome);
      setTipoId(option || null);
      setChamadoId(chamado.id || '');
      setTecnicoId(chamado.tecnico_nome || '');

      setTecnicoInicialVazio(chamado.tecnico_nome === "Sem técnico ainda");
    }
  }, [chamado]);

  useEffect(() => {
    handleBuscarTecnicos()
  }, [tipo_id]);

  const handleBuscarTecnicos = async () => {
    setErro('');
    const token = getCookie('token');

    const tipo = tipo_id?.value;

    let areaValue = 0;
    if (tipo === "Externo") areaValue = 1;
    else if (tipo === "Manutenção") areaValue = 2;
    else if (tipo === "Apoio Tecnico") areaValue = 3;
    else if (tipo === "Limpeza") areaValue = 4;

    try {
      const response = await fetch(`http://localhost:8080/usuarios/tecArea?area=${areaValue}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        setErro(result.mensagem || 'Erro ao buscar técnicos');
        return;
      }

      // Para cada técnico, buscar o nome pelo id
      const tecnicosComNome = await Promise.all(
        result.map(async (t) => {
          try {
            const resNome = await fetch(`http://localhost:8080/usuarios/${t.id_tecnico}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            const dadosNome = await resNome.json();
            return {
              value: t.id_tecnico,
              label: dadosNome.nome || `Técnico ${t.id_tecnico}`
            };
          } catch {
            return { value: t.id_tecnico, label: `Técnico ${t.id_tecnico}` };
          }
        })
      );

      setTecnicosArea(tecnicosComNome);
    } catch (error) {
      console.error('Erro ao buscar técnicos:', error);
      setErro('Erro na requisição');
    }
  };



  if (!mounted) return null;

  const handleSubmit = async () => {
    setErro('');
    const token = getCookie('token');

    let tecnicoParaEnviar = null;
    if (tecnico_id && tecnico_id !== "Sem técnico ainda") {
      tecnicoParaEnviar = parseInt(tecnico_id);
    }

    let areaValue = 0;
    if (tipo_id?.value === "Externo") areaValue = 1;
    else if (tipo_id?.value === "Manutenção") areaValue = 2;
    else if (tipo_id?.value === "Apoio Tecnico") areaValue = 3;
    else if (tipo_id?.value === "Limpeza") areaValue = 4;

    let tipo = 1

    if (tecnicoInicialVazio === false) tipo = 1
    else if (tecnicoInicialVazio === true) tipo = 2

    const dadosNovos = {
      TITULO: titulo,
      DESCRICAO: descricao,
      TIPO_ID: parseInt(areaValue),
      TECNICO_ID: tecnicoParaEnviar,
    };

    try {
      const response = await fetch(`http://localhost:8080/chamado/uptade/${chamadoId}?tipo=${tipo}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(dadosNovos)
      });

      const result = await response.json();

      if (!response.ok) {
        setErro(result.mensagem);
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleBackdropClick = (e) => {
    const modalEl = document.getElementById('modalEditar');
    const modal = window.bootstrap.Modal.getInstance(modalEl);

    if (!modal) return;

    if (e.target && e.target.classList && e.target.classList.contains('modal-backdrop')) {
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
            <h1 className="modal-title titulo-novo-medico">Editar Chamado</h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>

          <div className="modal-body">
            <div className="inputsCadastro">
              <label htmlFor="patrimonio" className="form-label">Patrimonio (Leitura):</label>
              <div className="input-group mb-3 rounded-start-pill rounded-end-pill">
                <span className="input-group-text rounded-start-pill">
                  <i className="bi bi-upc-scan"></i>
                </span>
                <input
                  type="text"
                  id="patrimonio"
                  disabled
                  className="form-control form-disabled rounded-5 rounded-start-0"
                  placeholder="Nº Patrimônio"
                  value={numeroPatrimonio}
                  onChange={(e) => setNumeroPatrimonio(e.target.value)}
                />
              </div>

              <label htmlFor="titulo" className="form-label">Título:</label>
              <div className="input-group mb-3 rounded-start-pill rounded-end-pill">
                <span className="input-group-text rounded-start-pill">
                  <i className="bi bi-type"></i>
                </span>
                <input
                  type="text"
                  id='titulo'
                  className="form-control rounded-5 rounded-start-0"
                  placeholder="Titulo"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                />
              </div>

              <label htmlFor="tipo" className="form-label">Área do Chamado {tecnicoInicialVazio ? '' : '(Leitura)'}:</label>
              <div className="input-group mb-3 rounded-start-pill rounded-end-pill align-items-center">
                <span className="input-group-text rounded-start-pill">
                  <i className="bi bi-tools"></i>
                </span>
                <div className="flex-grow-1">
                  <Select
                    id="tipo"
                    options={tipoOptions}
                    value={tipo_id}
                    isDisabled={!tecnicoInicialVazio}
                    onChange={(option) => {
                      setTipoId(option);
                      setTecnicoId('');
                    }}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        borderColor: "transparent",
                        outline: "none",
                        boxShadow: state.isFocused
                          ? "0 0 0 0.25rem rgba(181, 2, 2, 0.297)"
                          : "none", "&:hover": { borderColor: "transparent" },
                        borderTopRightRadius: "18px",
                        borderBottomRightRadius: "18px",
                      }),
                      menu: (base) => ({ ...base, overflow: "hidden" }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isSelected
                          ? "#b5000c"
                          : state.isFocused
                            ? "#f5c4c7"
                            : "white",
                        color: state.isSelected ? "white" : "#333",
                      }),
                    }}
                  />
                </div>
              </div>

              <label htmlFor="tecnicoId" className="form-label">
                Técnico {tecnicoInicialVazio ? '' : '(Leitura)'}:
              </label>
              <div className="input-group mb-3 rounded-start-pill rounded-end-pill">
                <span className="input-group-text rounded-start-pill">
                  <i className="bi bi-person-bounding-box"></i>
                </span>
                {tecnicoInicialVazio ? (
                  <div className="flex-grow-1">
                    <Select
                      id="tecnicoId"
                      options={tecnicosArea}
                      value={
                        tecnico_id
                          ? tecnicosArea.find(t => t.value === tecnico_id) || null
                          : null
                      }
                      onChange={(option) => setTecnicoId(option?.value || '')}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          borderColor: "transparent",
                          outline: "none",
                          boxShadow: state.isFocused
                            ? "0 0 0 0.25rem rgba(181, 2, 2, 0.297)"
                            : "none",
                          "&:hover": { borderColor: "transparent" },
                          borderTopRightRadius: "18px",
                          borderBottomRightRadius: "18px",
                        }),
                        menu: (base) => ({ ...base, overflow: "hidden" }),
                        option: (base, state) => ({
                          ...base,
                          backgroundColor: state.isSelected
                            ? "#b5000c"
                            : state.isFocused
                              ? "#f5c4c7"
                              : "white",
                          color: state.isSelected ? "white" : "#333",
                        }),
                      }}
                    />

                  </div>
                ) : (
                  <input
                    type="text"
                    id="tecnicoId"
                    className="form-control form-disabled rounded-5 rounded-start-0"
                    placeholder="Tecnico Id"
                    value={tecnico_id}
                    disabled
                  />
                )}
              </div>

              <label htmlFor="descricao" className="form-label">Descrição:</label>
              <div className="input-group mb-3 rounded-4">
                <span className="input-group-text rounded-start-pill">
                  <i className="bi bi-card-text"></i>
                </span>
                <div className="form-floating mb-3">
                  <textarea
                    className="form-control"
                    placeholder="Digite a descrição"
                    id="descricao"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    style={{
                      height: "120px",
                      padding: "10px",
                      paddingTop: "8px",
                      border: "none",
                      borderLeft: "1px solid #ccc",
                      borderTopRightRadius: "15px",
                      borderEndEndRadius: "15px",
                      boxShadow: "none",
                      outline: "none",
                      marginBottom: "-15px",
                      backgroundColor: "transparent",
                    }}
                  />
                </div>
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
      {erro && <Toast conteudo={erro} tipo="!ok" />}
    </div>
  );
}