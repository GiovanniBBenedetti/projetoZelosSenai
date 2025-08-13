'use client';
import './login.css';
import { useState } from 'react';
import { setCookie } from 'cookies-next/client';

export default function Login() {
  const [rm, setRm] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

  async function handleLogin() {
    const dados = JSON.stringify({
      username: rm,
      password: senha,
    });

    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: dados,
      });

      const data = await response.json();

      if (response.ok) {
        setCookie('token', data.token);
        alert(data.message);
        console.log(data)
      } else {
        setMensagem(data.error);
        alert(mensagem);
      }
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      setMensagem('Erro ao conectar com o servidor.');
    }
  }

  return (
    <div className="tudo">
      <div className="d-flex justify-content-start flex-wrap">
        <img className="Logos" src="./img/Logos.png" alt="Logo Senai" />
      </div>

      <div className="container d-flex justify-content-center align-items-center">
        <div className="mt-5">
          <div className="form-container">
            <p className="title">Login</p>
            <p className="descricao">Bem-vindo à plataforma Zelos!</p>

            <form className="form">
              <div className="input-group">
                <input
                  placeholder="Registro de Matrícula"
                  type="text"
                  name="rm"
                  value={rm}
                  onChange={(e) => setRm(e.target.value)}
                  className="input"
                />
                <input
                  placeholder="Senha"
                  type="password"
                  name="Senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="input"
                />
              </div>

              <button type="button" className="sign" onClick={handleLogin}>
                Login!
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}