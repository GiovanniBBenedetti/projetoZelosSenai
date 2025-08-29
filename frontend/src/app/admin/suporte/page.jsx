'use client';
import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Select from 'react-select';
import Box from '@mui/material/Box';
import { getCookie } from 'cookies-next';
import './styleSuporteAdm.css';

export default function TabelaPatrimonios() {
    const [mounted, setMounted] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [filtroRemetente, setFiltroRemetente] = useState('');
    const [filtroTitulo, setFiltroTitulo] = useState('');
    const [filtroDescricao, setFiltroDescricao] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('');

    const statusOptions = [
        { value: 'pendente', label: 'Pendente' },
        { value: 'resolvido', label: 'Resolvido' },
    ];

    useEffect(() => {
        setMounted(true);

        const token = getCookie('token');

        fetch('http://localhost:8080/duvidas', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
                if (!res.ok) throw new Error('Erro ao buscar dados da API');
                return res.json();
            })
            .then(data => {
                const adaptado = data.map(item => ({
                    id: item.id,
                    remetente: item.autor,
                    titulo: item.titulo,
                    descricao: item.descricao,
                    status_duvida: item.status_duvida,
                }));
                setTickets(adaptado);
            })
            .catch(err => console.error('Erro ao buscar dados:', err));
    }, []);

    const handleStatusChange = (id, novoStatus) => {
        setTickets(prev =>
            prev.map(ticket => (ticket.id === id ? { ...ticket, status_duvida: novoStatus } : ticket))
        );
    };
    const filtrado = tickets.filter(
        item =>
            item.remetente.toLowerCase().includes(filtroRemetente.toLowerCase()) &&
            item.titulo.toLowerCase().includes(filtroTitulo.toLowerCase()) &&
            item.descricao.toLowerCase().includes(filtroDescricao.toLowerCase()) &&
            item.status_duvida.toLowerCase().includes(filtroStatus.toLowerCase())
    );

    const columns = [
        { field: 'id', headerName: 'ID', width: 60, disableColumnMenu: true },
        { field: 'remetente', headerName: 'Remetente', width: 190, disableColumnMenu: true },
        { field: 'titulo', headerName: 'Título', width: 240, disableColumnMenu: true },
        {
            field: 'descricao',
            headerName: 'Descrição',
            flex: 1,
            minWidth: 300,
            disableColumnMenu: true,
            renderCell: params => <span title={params.value}>{params.value}</span>,
        },
        {
            field: 'status_duvida',
            headerName: 'status_duvida',
            width: 150,
            disableColumnMenu: true,
            renderCell: params => {
                const token = getCookie('token');
                const [selectedStatus, setSelectedStatus] = useState({
                    value: params.value,
                    label: params.value.charAt(0).toUpperCase() + params.value.slice(1),
                });

                const handleChange = async option => {
                    setSelectedStatus(option);
                    handleStatusChange(params.row.id, option.value);

                    try {
                        await fetch(`http://localhost:8080/duvidas/${params.row.id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({ status_duvida: option.value }),
                        });
                    } catch (err) {
                        console.error('Erro ao atualizar status:', err);
                    }
                };

                return (
                    <Select
                        options={statusOptions}
                        value={selectedStatus}
                        onChange={handleChange}
                        menuPortalTarget={document.body}
                        styles={{
                            control: provided => ({
                                ...provided,
                                backgroundColor: 'transparent',
                                border: 'none',
                                boxShadow: 'none',
                                minHeight: '30px',
                                fontSize: '0.9rem',
                            }),
                            singleValue: provided => ({ ...provided, color: '#000000' }),
                            option: (provided, state) => ({
                                ...provided,
                                backgroundColor: state.isFocused ? '#8e0009' : '#b5000c',
                                color: '#fff',
                                '&:active': { backgroundColor: '#8e0009' },
                            }),
                            indicatorSeparator: () => ({ display: 'none' }),
                            menuPortal: base => ({ ...base, zIndex: 9999 }),
                        }}
                        isSearchable={false}
                    />
                );
            },
        },
    ];

    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

    return (<>
        <div className="geral-patrimonios d-flex flex-column">
            <div className="container total-adm flex-grow-1 d-flex flex-column">
                <p className="tituloMedicos mb-3">Controle de Suporte:</p>

                {/* filtros */}
                <div className="container-filtro-pacientes mb-5 mb-sm-4 mt-4 mt-sm-0 pe-4">
                    <div className="row g-3">
                        <div className="col-12 col-md-6 custom-col-1080">
                            <label className="form-label">Filtrar por Remetente:</label>
                            <div className="input-group borda-filtro-usuario">
                                <button className="btn" type="button">
                                    <i className="bi bi-person-lines-fill"></i>
                                </button>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nome do remetente"
                                    value={filtroRemetente}
                                    onChange={e => setFiltroRemetente(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="col-12 col-md-6 custom-col-1080">
                            <label className="form-label">Filtrar por Título:</label>
                            <div className="input-group borda-filtro-usuario">
                                <button className="btn" type="button">
                                    <i className="bi bi-text-wrap"></i>
                                </button>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Título"
                                    value={filtroTitulo}
                                    onChange={e => setFiltroTitulo(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="col-12 col-md-6 custom-col-1080">
                            <label className="form-label">Filtrar por Descrição:</label>
                            <div className="input-group borda-filtro-usuario">
                                <button className="btn" type="button">
                                    <i className="bi bi-pencil-square"></i>
                                </button>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Descrição"
                                    value={filtroDescricao}
                                    onChange={e => setFiltroDescricao(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="col-12 col-md-6 custom-col-1080">
                            <label className="form-label">Filtrar por Status:</label>
                            <div className="input-group borda-filtro-usuario">
                                <button className="btn" type="button">
                                    <i className="bi bi-plus-slash-minus"></i>
                                </button>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Status"
                                    value={filtroStatus}
                                    onChange={e => setFiltroStatus(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="geral-table-patrimonio flex-grow-1 d-flex ps-4 pe-4 pb-4">

            <Box sx={{ flex: 1, display: 'flex', width: '100%' }}>
                {mounted && (
                    <Box sx={{ width: '100%' }}>
                        <DataGrid
                            rows={filtrado}
                            columns={columns}
                            paginationModel={paginationModel}
                            onPaginationModelChange={setPaginationModel}
                            pageSizeOptions={[10, 15, 20, 50]}
                            getRowId={row => row.id}
                            disableRowSelectionOnClick
                        />
                    </Box>
                )}
            </Box>

        </div>

    </>
    );

}
