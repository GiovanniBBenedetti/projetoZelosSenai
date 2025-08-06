'use client';

import { useState } from 'react';

export default function Suporte() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titulo || !descricao ) {
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
    <div className="container p-4">
      <h2>Enviar Dúvida</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="titulo" className="form-label">Título</label>
          <input
            type="text"
            id="titulo"
            className="form-control"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="descricao" className="form-label">Descrição</label>
          <textarea
            id="descricao"
            className="form-control"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary">Enviar</button>
      </form>
      {mensagem && <p className="mt-3">{mensagem}</p>}
    </div>
  );
}
