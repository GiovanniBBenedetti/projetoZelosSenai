'use client';

import { useState } from 'react';
import './suporte.css';
import Link from 'next/link';

export default function Suporte() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titulo || !descricao) {
      setMensagem('Preencha todos os campos antes de enviar.');
      return;
    }

    const formData = JSON.stringify({
      titulo: titulo || null,
      descricao: descricao || null,
    });

    try {
      const res = await fetch('http://localhost:8080/duvidas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibm9tZSI6Ikpvw6NvIGRhIFNpbHZhIiwiaWF0IjoxNzU0NTA0NjQ0LCJleHAiOjE3NTQ1MDgyNDR9.8uQGff3f4bRDOQ8VrE_JPZLzY_8CA-eIagiQvpkV49s`,
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

  return (

    <div className="fundo">
      <div className="geral-suporte">
        <div className="fundoBrancoSuporte">
          <div className="container p-4">
            <div className="row">
              <div className="col-12 col-md-6 endereco-suporte p-4">
                <h3 className="titulo-endereco-suporte">Localização</h3>
                <p className="title-escola mt-2">Senai Armando de Arruda Pereira</p>
                <p>R. Santo André, 680 - Boa Vista, São Caetano do Sul - SP, 09572-000</p>

                <h3 className="titulo-endereco-suporte mt-3">Siga-nos</h3>
                <Link href="https://www.linkedin.com/school/senaisp/" target="_blank">
                  <button type="button" className="me-2 btn btn-danger rounded-circle icone-suporte">
                    <i className="bi bi-linkedin"></i>
                  </button>
                </Link>
                <Link href="https://www.instagram.com/senai.sp/" target="_blank">
                  <button type="button" className="me-2 btn btn-danger rounded-circle icone-suporte">
                    <i className="bi bi-instagram"></i>
                  </button>
                </Link>
                <Link href="https://www.facebook.com/senaisaopaulo/" target="_blank">
                  <button type="button" className="btn btn-danger rounded-circle icone-suporte">
                    <i className="bi bi-facebook"></i>
                  </button>
                </Link>
              </div>

           
              <div className="col-12 col-md-6 formularioSuporte p-4">
                <h3 className="titulo-suporte">Enviar Dúvida</h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="titulo" className="form-label">Título</label>
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
                    <label htmlFor="descricao" className="form-label">Descrição</label>
                    <input
                      id="descricao"
                      placeholder="Envie sua mensagem"
                      className="form-control inputSuporte"
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-danger">Enviar</button>
                </form>
                {mensagem && <p className="mt-3 mensagem-erro-suporte">{mensagem}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
