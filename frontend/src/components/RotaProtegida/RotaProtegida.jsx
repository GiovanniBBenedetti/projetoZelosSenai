'use client';

import { useEffect, useState } from 'react';
import Loader from '@/components/Loader/Loader';
import { getCookie } from "cookies-next";
import { useRouter } from 'next/navigation';
import './403.css';

export default function RotaProtegida({ permitido, children }) {
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

    if (tipoUser === null) return <Loader />;

    if (!permitido.includes(tipoUser)) {
        return (
            <div className="Corpo403">
                <div className="Pai">
                    <div className="d-flex justify-content-center flex-wrap mb-2">
                        <img className="Logos" src="/img/Logos.png" alt="Logo Senai" />
                    </div>
                    <div className="Filho mt-5">
                        <div className="DivImagem d-flex justify-content-center">
                            <img className="ErroImg" src="/img/Placa403.png" alt="" />
                        </div>
                        <div className="text pb-2 pt-2">
                            <div className="textGrande">
                                <h1>Você não tem permissão!</h1>
                            </div>
                            <div className="textPequeno">
                                <h3>volte para a home.</h3>
                            </div>
                        </div>
                        <div className="button button-notfound">
                            <a className="notfound-button" href={redirecionar}>
                                Voltar
                            </a>

                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}