'use client';
import './login.css';
import { useState } from 'react';
import { setCookie } from 'cookies-next/client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setCookie('token', data.token);
        setCookie('funcao', data.user.funcao);
        setCookie('idUsuario', data.user.id);
        setCookie('nome', data.user.nome);
        setCookie('descricao', data.user.curso);

        if (data.user.funcao === 'usuario') {
          window.location.href = '/usuario';
        } else if (data.user.funcao === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/tecnico';
        }
      } else {
        toast.error('Número de cadastro ou senha incorreto', {
          position: 'top-right',
          autoClose: 2000,
          closeButton: false,
          hideProgressBar: false,
        });
      }
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      toast.error('Erro ao conectar com o servidor.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  }

  return (
    <>
      <style>
        {`
        button{
          all: inherit;
        }
        .loginButtonnnnn { 
          background: var(--vermelhoMedio);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%!important;
        }
        .loginButtonnnnn:hover {
          background: var(--vermelhoEscuro);
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }`}
      </style>
      <div className="loginWrapper">
        <ToastContainer />

        <div className='loginLogoOutside d-flex justify-content-center justify-content-md-start'>
          <img
            src="/img/Logos.png"
            alt="Logo Zelos"
          />
        </div>
        <div className="loginCard">

          <h2 className="loginTitle">Login</h2>
          <p className="loginSubtitle">Bem-vindo a plataforma zelos</p>

          <form onSubmit={handleLogin} className="loginForm">
            <input
              placeholder="Registro de Matrícula"
              type="text"
              value={username}
              onChange={(e) => setusername(e.target.value)}
              className="loginInput"
            />
            <input
              placeholder="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="loginInput"
            />
            <button
              type="submit"
              className="loginButtonnnnn"
              style={{ padding: "1rem" }}
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
