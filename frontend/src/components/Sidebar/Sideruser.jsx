'use client';

import './sideuser.css';
import { getCookie, deleteCookie } from 'cookies-next';
import LogoutUser from '../LogoutUser/LogoutUser';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Sideuser() {
  const [nomePerfil, setNomePerfil] = useState('');
  const [funcao, setFuncao] = useState('');

  useEffect(() => {
    const nome = getCookie('nome');
    const funcaoCookie = getCookie('funcao');
    if (nome) setNomePerfil(nome);
    if (funcaoCookie) setFuncao(funcaoCookie.toLowerCase());
  }, []);

  const handleLogout = async () => {


    const response = await fetch('http://localhost:8080/auth/logout', {
      method: 'POST',

    });

    const data = await response.json();


    deleteCookie('nome');
    deleteCookie('funcao');
    deleteCookie('token');
    deleteCookie('id');

    console.log(data)

  };

  const partes = nomePerfil.trim().split(' ');
  const iniciais =
    (partes[0]?.charAt(0).toUpperCase() || '') +
    (partes[partes.length - 1]?.charAt(0).toUpperCase() || '');
  const nomeExibido = `${partes[0]?.charAt(0).toUpperCase() + partes[0]?.slice(1).toLowerCase()} ${partes[partes.length - 1]
    ? partes[partes.length - 1].charAt(0).toUpperCase() +
    partes[partes.length - 1].slice(1).toLowerCase()
    : ''
    }`;

  // menus dinâmicos
  const menus = {
    tecnico: [
      { href: `/${funcao}`, icon: 'bi bi-book-fill', label: 'Dashboard', class: 'dashboard' },
      {
        type: 'dropdown',
        icon: 'bi bi-gear-fill',
        label: 'Chamados',
        items: [
          { href: `/${funcao}/meus-chamados`, label: 'Meus Chamados' },
          { href: `/${funcao}/todos-chamados`, label: 'Todos os Chamados' },
        ],
      },
      { href: `/${funcao}/ajuda`, icon: 'bi bi-chat-text-fill', label: 'Ajuda', class: 'ajuda' },
    ],
    admin: [
      { href: `/${funcao}`, icon: 'bi bi-book-fill', label: 'Dashboard', class: 'dashboard' },
      {
        type: 'dropdown',
        icon: 'bi bi-gear-fill',
        label: 'Chamados',
        items: [
          { href: `/${funcao}/criar-chamado`, label: 'Criar Chamado' },
          { href: `/${funcao}/todos-chamados`, label: 'Todos os Chamados' },
          { href: `/${funcao}/meus-chamados`, label: 'Meus Chamados' },
        ],
      },
      { href: `/${funcao}/usuarios`, icon: 'bi bi-person-fill', label: 'Usuários', class: 'usuarios' },
      { href: `/${funcao}/patrimonios`, icon: 'bi bi-cpu-fill', label: 'Patrimônios', class: 'patrimonios' },
      { href: `/${funcao}/suporte`, icon: 'bi bi-chat-text-fill', label: 'Ajuda', class: 'ajuda' },
    ],
    usuario: [
      { href: `/${funcao}/dashboard`, icon: 'bi bi-book-fill', label: 'Dashboard', class: 'dashboard' },
      {
        type: 'dropdown',
        icon: 'bi bi-gear-fill',
        label: 'Chamados',
        items: [
          { href: `/${funcao}/criar-chamado`, label: 'Criar Chamado' },
          { href: `/${funcao}/meus-chamados`, label: 'Meus Chamados' },
        ],
      },
      { href: `/${funcao}/suporte`, icon: 'bi bi-chat-text-fill', label: 'Ajuda', class: 'ajuda' },
    ],
  };

  const renderMenu = (menu) => {
    if (menu.type === 'dropdown') {
      return (
        <div key={menu.label} className="dropdown chamados">
          <button
            className="sidepage chamados dropdown-toggle w-100 text-start"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className={menu.icon}></i> {menu.label}
          </button>
          <ul className="dropdown-menu w-100">
            {menu.items.map((item) => (
              <li key={item.label}>
                <a className="dropdown-item" href={item.href}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    return (
      <a key={menu.label} href={menu.href}>
        <button className={'sidepage ' + menu.class}>
          <i className={menu.icon}></i> {menu.label}
        </button>
      </a>
    );
  };

  return (
    <>
      <div className="d-none d-md-block">
        <aside className="sidebar">
          <Link href={`/${funcao}`}>
            <img src="/logotipos/logoEscritaBranca.png" className="logo" alt="" />
          </Link>
          <div className="sidebtns">
            <button className="sidepage perfil">
              <img
                src={`https://imageslot.com/v1/600x400?fg=e30615&shadow=23272f&fontsize=128&text=${iniciais}&filetype=png&bold=1`}
                className="img-perfil"
              />
              <span className="nome-perfil">{nomeExibido}</span>
            </button>

            {menus[funcao]?.map((menu) => renderMenu(menu))}
          </div>
          <div className="logout" onClick={handleLogout}>
            <LogoutUser />
          </div>
        </aside>
      </div>

      {/* Sidebar Mobile (Offcanvas) */}
      <div className="d-md-none">
        <nav className="navbar">
          <button
            className="btn text-white"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasSidebar"
            aria-controls="offcanvasSidebar"
          >
            <i className="bi bi-list" style={{ fontSize: "1.5rem" }}></i>
          </button>
          <div className="nav-mobile">
            <img src="/logotipos/logoSenaiBranca.png" className='logo-senai' />
            <img src="/logotipos/logoEscritaBranca.png" className='logo-zelos' />
          </div>

        </nav>

        <div
          className="offcanvas offcanvas-start"
          tabIndex="-1"
          id="offcanvasSidebar"
          aria-labelledby="offcanvasSidebarLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasSidebarLabel">
              <img src="/logotipos/logoEscritaBranca.png" className="logo-mobile" alt="" />
            </h5>
            <button
              type="button"
              className="btn-close text-reset"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <div className="sidebtns">
              <button className="sidepage perfil">
                <img
                  src={`https://imageslot.com/v1/600x400?fg=e30615&shadow=23272f&fontsize=128&text=${iniciais}&filetype=png&bold=1`}
                  className="img-perfil"
                />
                <span className="nome-perfil">{nomeExibido}</span>
              </button>

              {menus[funcao]?.map((menu) => renderMenu(menu))}
            </div>

            <div className="logout-mobile" onClick={handleLogout}>
              <LogoutUser />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
