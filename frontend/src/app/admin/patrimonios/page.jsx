'use client';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import CadastroPatrimonio from '@/components/ModalCadastro/ModalCadastro';
import { DataGrid } from '@mui/x-data-grid';
import { getCookie } from 'cookies-next';
import './stylePatrimonio.css';

const columns = [
  { field: 'PATRIMONIO', headerName: 'Nº Patrimônio', width: 140, disableColumnMenu: true },
  { field: 'SALA', headerName: 'Sala', width: 70, disableColumnMenu: true },
  { field: 'EQUIPAMENTO', headerName: 'Nome do equipamento', width: 170, disableColumnMenu: true },
  { field: 'TIPO', headerName: 'Tipo de Equipamento', width: 190, disableColumnMenu: true },
  { field: 'STATUS', headerName: 'Status', width: 120, disableColumnMenu: true },
  { field: 'AQUISICAO', headerName: 'Data Aquisição', width: 140, disableColumnMenu: true },
  {
    field: 'OBSERVACAO',
    headerName: 'Observações',
    width: 300,
    flex: 1,
    disableColumnMenu: true,
    sortable: false,
    renderCell: (params) => <span title={params.value}>{params.value}</span>,
  },
];

export default function TabelaPatrimonios() {
  const [patrimonios, setPatrimonios] = useState([]);
  const [filtroPatrimonio, setFiltroPatrimonio] = useState('');
  const [filtroSala, setFiltroSala] = useState('');
  const [filtroEquipamento, setFiltroEquipamento] = useState('');
  const [filtroObservacoes, setFiltroObservacoes] = useState('');
  const [mounted, setMounted] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    setMounted(true);
    fetchPatrimonios();
  }, []);


  const fetchPatrimonios = async () => {
    try {
      const token = getCookie('token');
      const response = await fetch('http://localhost:8080/patrimonios', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Erro ao buscar patrimonios');

      const data = await response.json();
      setPatrimonios(data);
    } catch (error) {
      console.error(error);
    }
  };

  const filtrado = patrimonios.filter((item) =>
    (item.PATRIMONIO || '').toString().toLowerCase().includes(filtroPatrimonio.toLowerCase()) &&
    (item.SALA || '').toLowerCase().includes(filtroSala.toLowerCase()) &&
    (item.EQUIPAMENTO || '').toLowerCase().includes(filtroEquipamento.toLowerCase()) &&
    (item.OBSERVACAO || '').toLowerCase().includes(filtroObservacoes.toLowerCase())
  );

    return (
        <>
        <style type="text/css">
        {`
          .patrimonios {
            background-color: var(--branco); !important;
            color: var(--vermelho); !important;
            margin-left: 0 !important;
          };
        `}
      </style>
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

                <CadastroPatrimonio />

                <div className="geral-table-patrimonio flex-grow-1 d-flex" style={{ minHeight: 0 }}>
                    <Box sx={{ flex: 1, minHeight: 0, display: 'flex' }}>
                        {mounted && (
                            <Box sx={{ height: '630px', width: '100%' }}>
                                <DataGrid
                                    rows={filtrado}
                                    columns={columns}
                                    getRowId={(row) => row.PATRIMONIO} 
                                    paginationModel={paginationModel}
                                    onPaginationModelChange={setPaginationModel}
                                    pageSizeOptions={[10, 15, 20, 50]}
                                    disableRowSelectionOnClick
                                />

                            </Box>
                        )}
                    </Box>
                </div>
            </div>
        </div>
        </>
    );
}
