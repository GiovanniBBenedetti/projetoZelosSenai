'use client';

import Link from 'next/link';
import './Footer.css';

export default function Footer({ funcao }) {
    const footerLinks = {
        admin: [
            { link: `/${funcao}`, label: 'Dashboard' },
            { link: `/${funcao}/criar`, label: 'Criar Chamado' },
            { link: `/${funcao}/todosChamados`, label: 'Todos os Chamados' },
            { link: `/${funcao}/meusChamados`, label: 'Meus Chamados' },
            { link: `/${funcao}/usuarios`, label: 'Usuários' },
            { link: `/${funcao}/patrimonios`, label: 'Patrimônios' },
            { link: `/${funcao}/suporte`, label: 'Ajuda' },
        ],
        tecnico: [
            { link: `/${funcao}`, label: 'Dashboard' },
            { link: `/${funcao}/meusChamados`, label: 'Meus Chamados' },
            { link: `/${funcao}/todosChamados`, label: 'Todos os Chamados' },
            { link: `/${funcao}/suporte`, label: 'Suporte' },
        ],
        usuario: [
            { link: `/${funcao}/dashboard`, label: 'Dashboard' },
            { link: `/${funcao}/criar`, label: 'Criar Chamado' },
            { link: `/${funcao}/meusChamados`, label: 'Meus Chamados' },
            { link: `/${funcao}/suporte`, label: 'Ajuda' },
        ],
    };

    const linksToRender = footerLinks[funcao] || [];

    return (
        <>
            <footer className="footer" id="header">
                <div className="footer-container">
                    <div className="section-1">
                        <img src="/logotipos/logosJuntasBrancas.png" className="img-footer" alt="Zelos e Senai" />
                    </div>
                    <div className="section-2">
                        <ul>
                            {linksToRender.map((item, index) => (
                                <li key={index}>
                                    <Link href={item.link}>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="section-3">
                        <p>
                            Desenvolvido para otimizar a gestão de chamados e facilitar a
                            comunicação entre alunos e administração. Todos os direitos
                            reservados.
                        </p>
                        <p>&copy; 2025 SENAI | ZELOS </p>
                    </div>
                </div>
            </footer>
        </>
    );
}