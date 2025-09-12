'use client';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import React from 'react';
import Select from 'react-select';
import './criar.css';
import Button from '@/components/BotaoCriar/BotaoCriar';
import { getCookie } from 'cookies-next';

const opcoesTipos = [
  { value: '1', label: 'Externo' },
  { value: '2', label: 'Manutenção' },
  { value: '3', label: 'Apoio Técnico' },
  { value: '4', label: 'Limpeza' },
];

export default function CriarChamado() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [patrimonio, setPatrimonio] = useState(null);
  const [prioridade, setPrioridade] = useState(null);
  const [tipo, setTipo] = useState(null);
  const [resposta, setResposta] = useState('');
  const [paginaPatrimonio, setPaginaPatrimonio] = useState(0);
  const [selectedPatrimonio, setSelectedPatrimonio] = useState([]);

  function pagina0() {
    setPaginaPatrimonio(0);
    setPatrimonio('');
  }

  function pagina1() {
    setPaginaPatrimonio(1);
    setPatrimonio('');
  }

  useEffect(() => {
    const cookieJWT = getCookie('token');
    fetch(`http://localhost:8080/patrimonios`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + cookieJWT,
      },
    })
      .then(async (res) => {
        const data = await res.json();
        const options = data.map((item) => ({
          value: item.PATRIMONIO,
          label: `${item.PATRIMONIO} - ${item.EQUIPAMENTO}`,
        }));
        setSelectedPatrimonio(options);
      })
      .catch(() => {
        console.log('Erro ao buscar equipamentos');
      });
  }, []);

  async function chamado() {
    if (!titulo || !descricao || !patrimonio || !tipo || !prioridade) {
      return Swal.fire({
        imageUrl: '/error/erro_tomada.png',
        imageWidth: 310,
        imageHeight: 270,
        title: 'Ops...',
        text: `Por favor, preencha todos os campos!`,
        showConfirmButton: false,
        showCloseButton: true,
      });
    }

    const dados = JSON.stringify({
      titulo,
      descricao,
      patrimonio,
      prioridade,
      tipo,
    });

    const cookieJWT = getCookie('token');

    try {
      const response = await fetch('http://localhost:8080/chamado', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + cookieJWT,
        },
        body: dados,
      });

      const data = await response.json();
      if (response.ok) {
        setResposta(`Resposta: ${data.mensagem}`);
        setTitulo('');
        setDescricao('');
        setPatrimonio('');
        setPrioridade(null);
        setTipo(null);
        setPaginaPatrimonio(0)
        Swal.fire({
          imageUrl: '/sucsses/sucsses.png',
          imageWidth: 200,
          imageHeight: 200,
          title: 'Sucesso !',
          text: `${data.mensagem}`,
          showCloseButton: true,
        });
      } else {
        Swal.fire({
          imageUrl: '/error/erro_tomada.png',
          imageWidth: 310,
          imageHeight: 270,
          title: 'Ops...',
          text: `${data.mensagem}`,
          showConfirmButton: false,
          showCloseButton: true,
        });
      }
    } catch (error) {
      setResposta('Erro:', error);
    }
  }

  return (
    <>
      <div className="container-criar">
        <div className="inputs-criar mb-4">
          <div className="titulo-criar">
            <p style={{ marginBottom: '0rem' }}>
              Criar <span>Chamados</span>
            </p>
          </div>
          <div className="">
            <label className="form-label">Título:</label>
            <input
              type="text"
              className="input-criar"
              placeholder="Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>
          <div className="row">
            <div className="col-12 col-md-6">
              {paginaPatrimonio === 0 ? (
                <div className="">
                  <label className="form-label">
                    Número do Patrimônio (
                    <button onClick={pagina1} className="botao-patrimonio">
                      Não tem o número ?
                    </button>
                    ) :
                  </label>
                  <Select
                    instanceId="tipo-select"
                    classNamePrefix="select-tipo"
                    options={selectedPatrimonio}
                    value={
                      selectedPatrimonio.find(
                        (option) => option.value === patrimonio
                      ) || null
                    }
                    onChange={(selected) =>
                      setPatrimonio(selected?.value || '')
                    }
                    isSearchable
                    placeholder="Selecione..."
                  />
                </div>
              ) : (
                <div className="">
                  <label className="form-label">
                    Descrição do Patrimônio (
                    <button onClick={pagina0} className="botao-patrimonio">
                      Tem o número ?
                    </button>
                    ) :
                  </label>
                  <input
                    type="text"
                    className="input-criar"
                    placeholder="Descreva o patrimônio"
                    value={patrimonio}
                    onChange={(e) => setPatrimonio(e.target.value)}
                  />
                </div>
              )}
            </div>
            <div className="col-12 col-md-6 mt-4 mt-md-0">
              <div className="">
                <label className="form-label">Área responsável:</label>
                <Select
                  instanceId="tipo-select"
                  classNamePrefix="select-tipo"
                  options={opcoesTipos}
                  value={
                    opcoesTipos.find((option) => option.value === tipo) || null
                  }
                  onChange={(selected) => setTipo(selected?.value || '')}
                  placeholder="Selecione..."
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="">
                <label className="form-label">Descrição:</label>
                <textarea
                  type="text"
                  className="input-criar"
                  placeholder="Descrição"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  style={{ height: '130px' }}
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="d-flex flex-column gap-2">
                <label className="form-label mb-1">Grau de Prioridade:</label>
                <div className="form-check form-check-inline">
                  <input
                    id="prioridade1"
                    className="form-check-input input-azul"
                    type="radio"
                    name="inlineRadioOptions"
                    value="1"
                    checked={prioridade === "1"}
                    onChange={(e) => setPrioridade(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="prioridade1">
                    <i
                      className="bi bi-exclamation-triangle-fill me-2"
                      style={{ color: '#417bd5' }}
                    />
                    Preventiva
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    id="prioridade2"
                    className="form-check-input input-verde"
                    type="radio"
                    name="inlineRadioOptions"
                    value="2"
                    checked={prioridade === "2"}
                    onChange={(e) => setPrioridade(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="prioridade2">
                    <i
                      className="bi bi-exclamation-triangle-fill me-2"
                      style={{ color: '#4cc78b' }}
                    />
                    Sem Urgência
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    id="prioridade3"
                    className="form-check-input input-amarelo"
                    type="radio"
                    name="inlineRadioOptions"
                    value="3"
                    checked={prioridade === "3"}
                    onChange={(e) => setPrioridade(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="prioridade3">
                    <i
                      className="bi bi-exclamation-triangle-fill me-2"
                      style={{ color: '#ff9d59' }}
                    />
                    Prioritária
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    id="prioridade4"
                    className="form-check-input input-vermelho"
                    type="radio"
                    name="inlineRadioOptions"
                    value="4"
                    checked={prioridade === "4"}
                    onChange={(e) => setPrioridade(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="prioridade4">
                    <i
                      className="bi bi-exclamation-triangle-fill me-2"
                      style={{ color: '#d83d65' }}
                    />
                    Imediata
                  </label>
                </div>
              </div>

            </div>
          </div>
          <Button funcao={chamado} />
        </div>
      </div>
    </>
  );
}