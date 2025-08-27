'use client';

import { useState } from 'react';
import FooterLayout from "@/components/Footer/FooterLayout"; // Importe o novo componente
import Sidebar from "@/components/Sidebar/Sidebar";

export default function SidebarLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const showSidebar = () => {
        setIsSidebarOpen(prevState => !prevState);
    };

    return (
        <>
            <header className={`header ${isSidebarOpen ? 'left-pd' : ''}`} id="header">
                <div className="header__container">
                    <a href="#" className="header__logo">
                        <img src="./logotipos/logoEscritaBranca.png" alt="" />
                    </a>
                    
                    <button className="header__toggle" id="header-toggle" onClick={showSidebar}>
                        <i className="bi bi-list"></i>
                    </button>
                </div>
            </header>

            <Sidebar isSidebarOpen={isSidebarOpen} />

            <main className={`main ${isSidebarOpen ? 'left-pd' : ''}`} id="main">
                {children}
                <FooterLayout /> 
            </main>
        </>
    );
}