'use client';

import React, { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import './perfil.css';

export default function Perfil() {
    const [userData, setUserData] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [uploading, setUploading] = useState(false);

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
        return <p className="text-center mt-5">Carregando perfil...</p>;
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


          
            setPhotoPreview(URL.createObjectURL(file));

       
            setUserData({ ...userData, foto: URL.createObjectURL(file) });

        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="container my-5">
            <div className="card shadow">
                {userData.cover && (
                    <img
                        src={`http://localhost:8080${userData.foto}`}
                        className="card-img-top"
                        alt="Cover"
                        style={{ objectFit: 'cover', height: '200px' }}
                    />
                )}


                <div className="card-body">
                    <div className="d-flex flex-column flex-md-row align-items-center mb-4">
                        <div className="me-md-4 mb-3 mb-md-0">
                            {userData.foto || photoPreview ? (
                                <>
                                    <img
                                        src={photoPreview || `http://localhost:8080${userData.foto}`}
                                        alt="Profile"
                                        className="rounded-circle"
                                        style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                    />
                                    <label className="btn btn-primary btn-sm">
                                        {uploading ? 'Enviando...' : 'Upload Foto'}
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
                                    <label className="btn btn-primary btn-sm">
                                        {uploading ? 'Enviando...' : 'Upload Foto'}
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
                            <h3 className="card-title">{nomeExibido}</h3>
                            <p className="text-muted">{userData.descricao || 'Sem descrição'}</p>
                        </div>
                    </div>

                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Full Name</label>
                            <input type="text" className="form-control" value={userData.nome || ''} readOnly />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Email</label>
                            <input type="text" className="form-control" value={userData.email || ''} readOnly />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Numero de Registro</label>
                            <input type="text" className="form-control" value={userData.numeroRegistro || ''} readOnly />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Função</label>
                            <input type="text" className="form-control" value={userData.funcao || ''} readOnly />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Conta Criada</label>
                            <input
                                type="text"
                                className="form-control"
                                value={userData.criado_em ? new Date(userData.criado_em).toLocaleDateString('pt-BR') : ''}
                                readOnly
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
