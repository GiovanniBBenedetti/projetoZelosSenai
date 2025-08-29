'use client';

import { useState } from 'react';
import FooterLayout from "@/components/Footer/FooterLayout";
import Sidebar from "@/components/Sidebar/Sidebar";

export default function SidebarLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const showSidebar = () => {
        setIsSidebarOpen(prevState => !prevState);
    };

    return (
        <>
            <header className={`header ${isSidebarOpen ? 'left-pd' : ''}`} id="header">
                <div className="header__container">
                    <a href="#" className="header__logo">
                        <img src="/logoOriginal.png" alt="Logo" />
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
