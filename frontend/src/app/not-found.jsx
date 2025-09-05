"use client";
import Link from "next/link";
import "./not-found.css";
import { useEffect, useState } from 'react';
import { getCookie } from "cookies-next";
import { useRouter } from 'next/navigation';

export default function NotFoundPage() {
    const [tipoUser, setTipoUser] = useState(null);
    const [redirecionar, setRedirecionar] = useState('');
    const router = useRouter();

    useEffect(() => {
        const tipo = getCookie("funcao");

        if (!tipo) {
            router.push("/");
            return;
        }

        setTipoUser(tipo);

        const redirecionamentos = {
            tecnico: '/tecnico',
            usuario: '/usuario',
            admin: '/admin',
        };

        setRedirecionar(redirecionamentos[tipo] || '/');
    }, [router]);


    return (
        <>
            <div className="Pai">
                <div className="d-flex justify-content-center flex-wrap">
                    <img className="Logos" src="/img/Logos.png" alt="Logo Senai" />
                </div>


                <div className="layer1 d-flex">
                    <div className="notfound-page">
                        <div className="notfound-card-shadow"></div>
                        <div className="notfound-card">
                            <h1 className="notfound-code">404</h1>
                            <h2 className="notfound-error">ERROR</h2>
                            <p className="notfound-message">Não foi possível encontrar esta página, volte para a pagina inicial!</p>
                            <Link href={redirecionar}>
                                <button className="notfound-button">Voltar!</button>
                            </Link>
                        </div>
                    </div>
                    <div className="ParteTomada">
                        <img className="Tomada" src="/img/Tomada.png" alt="" />
                    </div>
                </div>


            </div>
        </>
    );
}
