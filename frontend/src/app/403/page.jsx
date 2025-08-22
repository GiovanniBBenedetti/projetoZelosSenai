"use client";
import Link from "next/link";
import "./403.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Forbidden() {
    return (
        <>
            <div className="Pai">
                <div className="d-flex justify-content-center flex-wrap">
                    <img className="Logos" src="./img/Logos.png" alt="Logo Senai" />
                </div>
                <div className="Filho">
                    <div className="DivImagem">
                        <img className="ErroImg" src="./img/Placa403.png" alt="" />
                    </div>
                    <div className="text">
                        <div className="textGrande">
                            <h1>Você não tem permissão!</h1>
                        </div>
                        <div className="textPequeno">
                            <h3>volte para a home.</h3>
                        </div>
                    </div>
                    <div className="button">
                        <Link href="/">
                            <button className="notfound-button">Voltar!</button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
