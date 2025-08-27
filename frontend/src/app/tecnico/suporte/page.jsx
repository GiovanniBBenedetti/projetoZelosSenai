'use client';

import { useState, useEffect } from 'react';
import { getCookie } from 'cookies-next';
import './suporte.css';

export default function TecnicoSuporte() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [usuario, setUsuario] = useState(null);





  const fetchUsuario = async () => {
    try {
      const idUsuario = parseInt(getCookie('idUsuario'));
      const token = getCookie('token');

      const res2 = await fetch(`http://localhost:8080/usuarios/${idUsuario}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res2.ok) throw new Error('Erro ao buscar usuário');

      const informacao = await res2.json();
      console.log(informacao);
      setUsuario(informacao);
    } catch (err) {
      console.error(err);
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titulo || !descricao) {
      setMensagem('Preencha todos os campos antes de enviar.');
      return;
    }

    const formData = JSON.stringify({
      titulo,
      descricao,
    });

    try {
      const token = getCookie('token');

      const res = await fetch('http://localhost:8080/duvidas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        setMensagem('Enviado com sucesso!');
        setTitulo('');
        setDescricao('');
      } else {
        setMensagem('Erro ao enviar a dúvida.');
      }
    } catch (error) {
      console.error('Erro ao criar dúvida:', error);
      setMensagem('Erro na requisição. Verifique o console.');
    }
  };

  
  useEffect(() => {
    fetchUsuario();
  }, []);

  return (
    <div className="fundo">
      <div className="geral-suporte">
        <div className="fundoBrancoSuporte">
          <div className="container">
            <div className="row">
              <div className="col-12 col-lg-6 endereco-suporte">
                <p className="subtitulo-suporte">Precisa de ajuda?</p>
                <h1 className="titulo-endereco-suporte">Prontos para ouvir você e oferecer a melhor solução.</h1>
                <p className="title-escola mt-2">
                  Quer mais informações, suporte ou ajuda personalizada? Preencha o formulário e nossa equipe retornará o mais rápido possível.
                </p>

                <div className="geral-suporte-infos-exp">
                  <i className="bi bi-house-door-fill icon-suporte"></i>
                  <div className="endereco-suportes">
                    <p className="endereco-suporte-1">Endereço</p>
                    <p className="endereco-suporte-2">R. Boa Vista, 825 - São Caetano do Sul, SP</p>
                  </div>
                </div>

                <div className="geral-suporte-infos">
                  <div className="geral-suporte-infos-exp">
                    <i className="bi bi-telephone-fill icon-suporte"></i>
                    <div className="telefone-suporte">
                      <p className="telefone-suporte-1">Telefone</p>
                      <p className="telefone-suporte-2">(11) 4227-7450</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-6 formularioSuporte p-4">
                <div className="col-12 col-lg-6 fundo-formularioSuporte">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <fieldset disabled>
                        <div className="mb-3">
                          <label className="form-label suporte-label">Nome</label>
                          <input
                            type="text"
                            className="form-control"
                            defaultValue={usuario?.nome || ''}
                            placeholder="Nome da pessoa"
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label suporte-label">Função</label>
                          <input
                            type="text"
                            className="form-control"
                            defaultValue={usuario?.funcao || ''}
                            placeholder="Função da pessoa"
                          />
                        </div>
                      </fieldset>

                      <label htmlFor="titulo" className="form-label suporte-label">Título</label>
                      <input
                        type="text"
                        placeholder="Título"
                        id="titulo"
                        className="form-control inputSuporte"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="descricao" className="form-label suporte-label">Descrição</label>
                      <textarea
                        id="descricao"
                        placeholder="Envie sua mensagem"
                        className="form-control inputSuporte"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="cssbuttons-io-button">
                      Enviar
                      <div className="icon">
                        <svg height={24} width={24} viewBox="0 0 24 24">
                          <path d="M0 0h24v24H0z" fill="none" />
                          <path
                            d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                    </button>
                  </form>
                  {mensagem && <p className="mt-3 mensagem-erro-suporte">{mensagem}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
