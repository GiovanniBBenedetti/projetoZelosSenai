'use client';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import CadastroPatrimonio from '@/components/ModalCadastro/ModalCadastro';
import { DataGrid } from '@mui/x-data-grid';
import './stylePatrimonio.css';

const columns = [
    { field: 'id', headerName: 'ID', width: 60, disableColumnMenu: true },
    { field: 'patrimonio', headerName: 'Nº Patrimônio', width: 140, disableColumnMenu: true },
    { field: 'sala', headerName: 'Sala', width: 70, disableColumnMenu: true },
    { field: 'equipamento', headerName: 'Tipo de Equipamento', width: 190, disableColumnMenu: true },
    { field: 'status', headerName: 'Status', width: 120, disableColumnMenu: true },
    { field: 'dataAquisicao', headerName: 'Data Aquisição', width: 140, disableColumnMenu: true },
    {
        field: 'observacoes',
        headerName: 'Observações',
        width: 300,
        flex: 1,
        disableColumnMenu: true,
        sortable: false,
        renderCell: (params) => <span title={params.value}>{params.value}</span>,
    },
];

// Gi aqui é o ngc q pode apagar
const patrimonioMock = [
    {
        id: 1,
        patrimonio: '12345',
        sala: '101',
        equipamento: 'Computador',
        status: 'Ativo',
        dataAquisicao: '01/02/2023',
        observacoes: 'HD 500GB, memória 8GB, Windows 10',
    },
    {
        id: 2,
        patrimonio: '54321',
        sala: '202',
        equipamento: 'Projetor',
        status: 'Manutenção',
        dataAquisicao: '15/06/2022',
        observacoes: 'Lampada trocada em 06/2024, cabo HDMI incluso',
    },
    {
        id: 3,
        patrimonio: '67890',
        sala: '305',
        equipamento: 'Impressora',
        status: 'Ativo',
        dataAquisicao: '20/11/2021',
        observacoes: 'Multifuncional, falta toner preto',
    },

    {
        id: 4,
        patrimonio: '11223',
        sala: '101',
        equipamento: 'Monitor',
        status: 'Ativo',
        dataAquisicao: '10/03/2023',
        observacoes: 'Monitor LED 24 polegadas',
    },
    {
        id: 5,
        patrimonio: '44556',
        sala: '102',
        equipamento: 'Teclado',
        status: 'Ativo',
        dataAquisicao: '05/07/2022',
        observacoes: 'Teclado mecânico, cabo USB',
    },
    {
        id: 6,
        patrimonio: '77889',
        sala: '103',
        equipamento: 'Mouse',
        status: 'Ativo',
        dataAquisicao: '12/12/2021',
        observacoes: 'Mouse sem fio, bateria nova',
    },
    {
        id: 7,
        patrimonio: '99001',
        sala: '104',
        equipamento: 'Roteador',
        status: 'Manutenção',
        dataAquisicao: '23/05/2020',
        observacoes: 'Firmware atualizado em 2024',
    },
    {
        id: 8,
        patrimonio: '22334',
        sala: '105',
        equipamento: 'Switch',
        status: 'Ativo',
        dataAquisicao: '15/08/2019',
        observacoes: 'Switch 24 portas, gerenciável',
    },
    {
        id: 9,
        patrimonio: '55667',
        sala: '201',
        equipamento: 'Notebook',
        status: 'Ativo',
        dataAquisicao: '30/01/2024',
        observacoes: 'Notebook Dell, SSD 512GB',
    },
    {
        id: 10,
        patrimonio: '88990',
        sala: '202',
        equipamento: 'Projetor',
        status: 'Ativo',
        dataAquisicao: '20/11/2022',
        observacoes: 'Projetor Full HD, lâmpada nova',
    },
    {
        id: 11,
        patrimonio: '33445',
        sala: '203',
        equipamento: 'Impressora',
        status: 'Ativo',
        dataAquisicao: '08/04/2021',
        observacoes: 'Impressora laser, cartucho substituído',
    },
    {
        id: 12,
        patrimonio: '66778',
        sala: '204',
        equipamento: 'Telefone IP',
        status: 'Ativo',
        dataAquisicao: '18/09/2023',
        observacoes: 'Telefone com headset',
    },
    {
        id: 13,
        patrimonio: '99012',
        sala: '205',
        equipamento: 'Webcam',
        status: 'Ativo',
        dataAquisicao: '27/02/2023',
        observacoes: 'Webcam HD para videoconferência',
    },
];


export default function TabelaPatrimonios() {
    const [patrimonios] = useState(patrimonioMock);
    const [filtroPatrimonio, setFiltroPatrimonio] = useState('');
    const [filtroSala, setFiltroSala] = useState('');
    const [filtroEquipamento, setFiltroEquipamento] = useState('');
    const [filtroObservacoes, setFiltroObservacoes] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const filtrado = patrimonios.filter((item) =>
        item.patrimonio.toLowerCase().includes(filtroPatrimonio.toLowerCase()) &&
        item.sala.toLowerCase().includes(filtroSala.toLowerCase()) &&
        item.equipamento.toLowerCase().includes(filtroEquipamento.toLowerCase()) &&
        (item.observacoes || '').toLowerCase().includes(filtroObservacoes.toLowerCase())
    );

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    return (
        <div className="geral-patrimonios vh-100 d-flex flex-column">
            <div className="container total-adm flex-grow-1 d-flex flex-column">
                <p className="tituloMedicos mb-3">Controle de Patrimônios:</p>

                <div className="container-filtro-pacientes mb-5 mb-sm-4 mt-4 mt-sm-0">
                    <div className="row g-3">
                        <div className="col-12 col-md-6 custom-col-1080">
                            <label className="form-label">Filtrar por Nº Patrimônio:</label>
                            <div className="input-group borda-filtro-usuario">
                                <button className="btn" type="button">
                                    <i className="bi bi-upc-scan"></i>
                                </button>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nº Patrimônio"
                                    value={filtroPatrimonio}
                                    onChange={(e) => setFiltroPatrimonio(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="col-12 col-md-6 custom-col-1080">
                            <label className="form-label">Filtrar por Sala:</label>
                            <div className="input-group borda-filtro-usuario">
                                <button className="btn" type="button">
                                    <i className="bi bi-door-open"></i>
                                </button>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Sala"
                                    value={filtroSala}
                                    onChange={(e) => setFiltroSala(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="col-12 col-md-6 custom-col-1080">
                            <label className="form-label">Filtrar por Tipo:</label>
                            <div className="input-group borda-filtro-usuario">
                                <button className="btn" type="button">
                                    <i className="bi bi-hdd-network"></i>
                                </button>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Tipo de Equipamento"
                                    value={filtroEquipamento}
                                    onChange={(e) => setFiltroEquipamento(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="col-12 col-md-6 custom-col-1080">
                            <label className="form-label">Filtrar por Observações:</label>
                            <div className="input-group borda-filtro-usuario">
                                <button className="btn" type="button">
                                    <i className="bi bi-journal-text"></i>
                                </button>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Observações"
                                    value={filtroObservacoes}
                                    onChange={(e) => setFiltroObservacoes(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>



                <div>
                    <CadastroPatrimonio />
                </div>

                <div className="geral-table-patrimonio flex-grow-1 d-flex" style={{ minHeight: 0 }}>
                    <Box sx={{ flex: 1, minHeight: 0, display: 'flex' }}>
                        {mounted && (
                            <Box sx={{ height: '630px', width: '100%' }}>
                                <DataGrid
                                    rows={filtrado}
                                    columns={columns}
                                    paginationModel={paginationModel}
                                    onPaginationModelChange={setPaginationModel}
                                    pageSizeOptions={[10, 15, 20, 50]}
                                    getRowId={(row) => row.id}
                                    disableRowSelectionOnClick
                                />
                            </Box>
                        )}
                    </Box>
                </div>
            </div>
        </div>
    );
}
