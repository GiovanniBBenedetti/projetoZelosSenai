'use client';

import { useState, useEffect } from 'react';
import { getCookie, deleteCookie } from 'cookies-next';
import './Sidebar.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = ({ isSidebarOpen }) => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [funcao, setFuncao] = useState('');
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState({});
  const [userData, setUserData] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    const name = getCookie('nome');
    const email = getCookie('descricao');
    const funcaoCookie = getCookie('funcao');

    if (name) setUserName(name);
    if (email) setUserEmail(email);
    if (funcaoCookie) setFuncao(funcaoCookie.toLowerCase());

    const fetchUserData = async () => {
      try {
        const token = getCookie('token');
        const res = await fetch('http://localhost:8080/usuarios/perfil', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Erro ao buscar dados do usuário');

        const data = await res.json();
        setUserData(data);

        // Se a resposta tiver caminho da foto, define a URL
        if (data.foto) {
          setPhotoUrl(`http://localhost:8080${data.foto}`);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    deleteCookie('nome');
    deleteCookie('descricao');
    deleteCookie('funcao');
    deleteCookie('token');
    deleteCookie('id');
    window.location.href = '/';
  };

  const toggleDropdown = (label) => {
    setIsDropdownOpen(prevState => ({
      ...prevState,
      [label]: !prevState[label],
    }));
  };

  const partes = userName.trim().split(' ');
  const iniciais =
    (partes[0]?.charAt(0).toUpperCase() || '') +
    (partes[partes.length - 1]?.charAt(0).toUpperCase() || '');

  const nomeExibido = `${partes[0]?.charAt(0).toUpperCase() + partes[0]?.slice(1).toLowerCase()} ${partes[partes.length - 1]
    ? partes[partes.length - 1].charAt(0).toUpperCase() +
      partes[partes.length - 1].slice(1).toLowerCase()
    : ''
  }`;

  const menus = {
    admin: [
      { link: '/admin/perfil', icon: 'bi bi-person-fill', label: 'Perfil' },
      { link: '/admin', icon: 'bi bi-pie-chart-fill', label: 'Dashboard' },
      {
        type: 'dropdown',
        icon: 'bi bi-gear-fill',
        label: 'Chamados',
        items: [
          { link: '/admin/criar', icon: 'bi bi-pencil-square', label: 'Criar Chamado' },
          { link: '/admin/todosChamados',icon: 'bi bi-border-all', label: 'Todos os Chamados' },
          { link: '/admin/meusChamados',icon: 'bi bi-folder-fill', label: 'Meus Chamados' },
        ],
      },
      { link: '/admin/usuarios', icon: 'bi bi-person-fill', label: 'Usuários' },
      { link: '/admin/patrimonios', icon: 'bi bi-cpu-fill', label: 'Patrimônios' },
      { link: '/admin/suporte', icon: 'bi bi-chat-text-fill', label: 'Ajuda' },
    ],
    usuario: [
       { link: '/usuario/perfil', icon: 'bi bi-person-fill', label: 'Perfil' },
      { link: '/usuario', icon: 'bi bi-pie-chart-fill', label: 'Dashboard' },
      {
        type: 'dropdown',
        icon: 'bi bi-gear-fill',
        label: 'Chamados',
        items: [
          { link: '/usuario/criar',icon: 'bi bi-pencil-square', label: 'Criar Chamado' },
          { link: '/usuario/meusChamados',icon: 'bi bi-folder-fill', label: 'Meus Chamados' },
        ],
      },
      { link: '/usuario/suporte', icon: 'bi bi-chat-text-fill', label: 'Ajuda' },
    ],
    tecnico: [
       { link: '/tecnico/perfil', icon: 'bi bi-person-fill', label: 'Perfil' },
      { link: '/tecnico/', icon: 'bi bi-pie-chart-fill', label: 'Dashboard' },
      {
        type: 'dropdown',
        icon: 'bi bi-gear-fill',
        label: 'Chamados',
        items: [
          { link: '/tecnico/chamados',icon: 'bi bi-folder-fill', label: 'Meus Chamados' },
          { link: '/tecnico/todosChamados',icon: 'bi bi-border-all', label: 'Chamados da Área' },
        ],
      },
      { link: '/tecnico/suporte', icon: 'bi bi-chat-text-fill', label: 'Suporte' },
    ],
  };

  const renderMenuItems = (menu) => {
    if (menu.type === 'dropdown') {
      const isOpen = isDropdownOpen[menu.label];
      return (
        <div key={menu.label}>
          <a className="sidebar__link" onClick={() => toggleDropdown(menu.label)}>
            <i className={menu.icon}></i>
            <span>{menu.label}</span>
            <i className={`bi bi-chevron-down dropdown-icon ${isOpen ? 'rotate' : ''}`}></i>
          </a>
          {isOpen && (
            <div className="dropdown-content">
              {menu.items.map((item) => (
                <Link
                  key={item.label}
                  href={item.link}
                  className={`dropdown-item ${pathname === item.link ? 'active-link' : ''}`}
                >
                  <i className={item.icon}></i>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={menu.label}
        href={menu.link}
        className={`sidebar__link ${pathname === menu.link ? 'active-link' : ''}`}
      >
        <i className={menu.icon}></i>
        <span>{menu.label}</span>
      </Link>
    );
  };

  return (
    <nav className={`sidebar ${isSidebarOpen ? 'show-sidebar' : ''}`} id="sidebar">
      <div className="sidebar__container">
        <div className="sidebar__user">
          <div className="sidebar__img">
            {photoUrl ? (
              <img src={photoUrl} alt="Foto do usuário" className="sidebar__avatar-img" />
            ) : (
              <div className="sidebar__avatar">{iniciais}</div>
            )}
          </div>
          <div className="sidebar__info">
            <h3><strong>{nomeExibido}</strong></h3>
            <span>{userEmail}</span>
          </div>
        </div>

        <div className="sidebar__content">
          <div>
            <h3 className="sidebar__title">MENU</h3>
            <div className="sidebar__list">
              {menus[funcao]?.map(renderMenuItems)}
            </div>
          </div>
        </div>

        <div className="sidebar__actions">
          <button className="sidebar__link" onClick={handleLogout}>
            <i className="bi bi-door-closed-fill"></i>
            <span>Sair</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
