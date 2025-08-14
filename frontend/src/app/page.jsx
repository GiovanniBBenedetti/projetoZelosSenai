'use client';
import './login.css';
import { useState } from 'react';
import { setCookie } from 'cookies-next/client';

export default function Login() {
  const [rm, setRm] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

  async function handleLogin() {
    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: rm, password: senha }),
      });

      const data = await response.json();

      if (response.ok) {
        setCookie('token', data.token);
        alert(data.message);
      } else {
        setMensagem(data.error || 'Credenciais inválidas.');
        alert(data.error || 'Credenciais inválidas.');
      }
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      setMensagem('Erro ao conectar com o servidor.');
      alert('Erro ao conectar com o servidor.');
    }
  }

  return (
    <div className="tudo">
      {/* Logo fixa no canto superior esquerdo */}
      <img className="Logos" src="./img/Logos.png" alt="Logo Senai" />

      {/* Formulário centralizado */}
      <div className="loginContainer">
        <div className="form-container">
          <p className="title">Login</p>
          <p className="descricao">Bem-vindo à plataforma Zelos!</p>

          <form
            className="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <div className="input-group">
              <input
                placeholder="Registro de Matrícula"
                type="text"
                value={rm}
                onChange={(e) => setRm(e.target.value)}
                className="input"
              />
              <input
                placeholder="Senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="input"
              />
            </div>
            <button type="submit" className="sign">
              Login!
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
