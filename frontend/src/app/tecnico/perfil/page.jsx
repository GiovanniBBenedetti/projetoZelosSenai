'use client';

import Loader from '@/components/Loader/Loader';
import React, { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './perfil.css';

export default function Perfil() {

    const [userData, setUserData] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [value, onChange] = useState(new Date());

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = getCookie('token');
                const res = await fetch('http://localhost:8080/usuarios/perfil', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) throw new Error('Erro ao buscar dados do usuário');

                const data = await res.json();
                setUserData(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchUserData();
    }, []);

    if (!userData) {
        return <Loader />;
    }


    const nome = userData.nome || '';
    const partes = nome.trim().split(' ');
    const iniciais =
        (partes[0]?.charAt(0).toUpperCase() || '') +
        (partes[partes.length - 1]?.charAt(0).toUpperCase() || '');
    const nomeExibido = `${partes[0]?.charAt(0).toUpperCase() + partes[0]?.slice(1).toLowerCase()} ${partes[partes.length - 1]
        ? partes[partes.length - 1].charAt(0).toUpperCase() + partes[partes.length - 1].slice(1).toLowerCase()
        : ''
        }`;

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const token = getCookie('token');
        const formData = new FormData();
        formData.append('foto', file);

        try {
            const res = await fetch('http://localhost:8080/usuarios/perfil/foto', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });


            console.log(res)

            setPhotoPreview(URL.createObjectURL(file));
            setUserData({ ...userData, foto: URL.createObjectURL(file) });

        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <div className='geral-perfil py-4'>
                <div className='superior-perfil me-4 ms-2'>
                    <div className="col-md-12 photo-perfil d-flex flex-column flex-md-row align-items-center mb-4">
                        <div className="photo-img-perfil me-md-4 mb-3 mb-md-0">
                            {userData.foto || photoPreview ? (
                                <>
                                    <img
                                        src={photoPreview || `http://localhost:8080${userData.foto}`}
                                        alt="Profile"
                                        className="rounded-circle"
                                        style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                    />
                                    <label className="btn photo-btn-perfil mt-3">
                                        {uploading ? 'Enviando...' : 'Upload Foto '}
                                        <i className="bi bi-cloud-arrow-up"></i>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoUpload}
                                            style={{ display: 'none' }}
                                            disabled={uploading}
                                        />
                                    </label>
                                </>
                            ) : (
                                <div className="fotoPerfil d-flex flex-column align-items-center justify-content-center">
                                    <div className="AvatarPerfil mb-2">{iniciais}</div>
                                    <label className="btn photo-btn-perfil">
                                        {uploading ? 'Enviando...' : 'Upload Foto '}
                                        <i className="bi bi-cloud-arrow-up"></i>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoUpload}
                                            style={{ display: 'none' }}
                                            disabled={uploading}
                                        />

                                    </label>
                                </div>
                            )}
                        </div>
                        <div className="text-center text-md-start">
                            <h3 className="card-title fs-1">{nomeExibido}</h3>
                            <p className="">{userData.descricao || 'Sem descrição'}</p>
                        </div>
                    </div>
                </div>

                <div className='inferior-perfil'>
                    <div className='inferior-esquerda-perfil me-2'>
                        <div className='cima-inferior-esquerda-perfil p-4 m-2'>
                            <div className="row">
                                <div className="col-md-6 lado1">
                                    <label className="">Email:</label>
                                    <input type="text" className="fw-bolder form-control form-controlPerfil InputPerfil fst-italic" value={userData.email || ''} readOnly disabled />
                                    <label className="">N° de Registro:</label>
                                    <input type="text" className="fw-bolder form-control  form-controlPerfil InputPerfil fst-italic" value={userData.numeroRegistro || ''} readOnly disabled />
                                </div>
                                <div className="col-md-6 lado2">
                                    <label className="">Função:</label>
                                    <input type="text" className="fw-bolder form-control form-controlPerfil InputPerfil fst-italic" value={userData.funcao || ''} readOnly disabled />
                                    <label className="">Conta Criada em:</label>
                                    <input
                                        type="text"
                                        className="fw-bolder form-control form-controlPerfil InputPerfil fst-italic"
                                        value={userData.criado_em ? new Date(userData.criado_em).toLocaleDateString('pt-BR') : ''}
                                        readOnly disabled
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='baixo-inferior-esquerda-perfil p-4 m-2 mt-3'>
                            <p className='welcome fs-5 mt-1'>Bem-vindo ao sistema de suporte. Estamos aqui para ajudar a resolver suas demandas rapidamente!</p>
                            <div className='linha-inferior-perfil mb-2'></div>
                        </div>
                    </div>

                    <div className='inferior-direita-perfil p-2 m-2 ms-4 ps-3'>
                        <Calendar onChange={onChange} value={value} />
                    </div>
                </div>
            </div>
        </>
    );
}
