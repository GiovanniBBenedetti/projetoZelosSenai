'use client';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import BotaoNovo from '@/components/BotaoNovo/BotaoNovo';
import ModalEditar from '@/components/ModalEditar/ModalEditar';
import { DataGrid } from '@mui/x-data-grid';
import { getCookie } from 'cookies-next';
import Select from 'react-select';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styleChamado.css';

const prioridadeOptions = [
  { value: '1', label: 'Preventiva' },
  { value: '2', label: 'Sem Urgência' },
  { value: '3', label: 'Prioritária' },
  { value: '4', label: 'Imediata' },
];



export default function TabelaChamados() {
  const [chamados, setChamados] = useState([]);
  const [filtroPatrimonio, setFiltroPatrimonio] = useState('');
  const [filtroTitulo, setFiltroTitulo] = useState('');
  const [filtroPrioridade, setFiltroPrioridade] = useState('');
  const [filtroDescricoes, setFiltroDescricoes] = useState('');
  const [mounted, setMounted] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [chamadoSelecionado, setChamadoSelecionado] = useState(null);

  useEffect(() => {
    setMounted(true);
    fetchChamados();
  }, []);

  const fetchChamados = async () => {
    try {
      const token = getCookie('token');
      const response = await fetch('http://localhost:8080/chamado/todos', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Erro ao buscar chamados');

      const data = await response.json();

      const mapped = data.map((item) => ({
        id: item.id,
        titulo: item.titulo,
        descricao: item.descricao,
        patrimonio: item.patrimonio,
        grau_prioridade: item.grau_prioridade,
        tipo_id: item.tipo_id,
        tecnico_id: item.tecnico_id ? item.tecnico_id : 'Sem técnico ainda',
        usuario_id: item.usuario_id,
        status: item.status,
        criado_em: new Date(item.criado_em).toLocaleString('pt-BR'),
        atualizado_em: new Date(item.atualizado_em).toLocaleString('pt-BR')
      }));

      setChamados(mapped);
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 40, disableColumnMenu: true },
    { field: 'titulo', headerName: 'Título', width: 270, disableColumnMenu: true },
    { field: 'descricao', headerName: 'Descrição', width: 270, disableColumnMenu: true },
    { field: 'patrimonio', headerName: 'Patrimônio', width: 150, disableColumnMenu: true },
    {
      field: 'grau_prioridade',
      headerName: 'Prioridade',
      width: 150,
      disableColumnMenu: true,
      renderCell: (params) => {
        const token = getCookie('token');

        const handleChange = async (selectedOption) => {
          try {
            await fetch(`http://localhost:8080/chamado/grauPrioridade/${params.row.id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ grau_prioridade: selectedOption.value }),
            });

            params.api.updateRows([{ id: params.id, grau_prioridade: selectedOption.value }]);
          } catch (err) {
            console.error("Erro ao atualizar prioridade:", err);
          }
        };

        return (
          <Select
            options={prioridadeOptions}
            value={prioridadeOptions.find(opt => opt.value === params.row.grau_prioridade)}
            onChange={handleChange}
            menuPortalTarget={document.body}
            styles={{
              control: (provided) => ({
                ...provided,
                backgroundColor: 'transparent',
                border: 'none',
                boxShadow: 'none',
                minHeight: '30px',
                fontSize: '0.9rem',
              }),
              singleValue: (provided) => ({ ...provided, color: '#000000' }),
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isFocused ? '#8e0009' : '#b5000c',
                color: '#fff',
                '&:active': { backgroundColor: '#8e0009' },
              }),
              indicatorSeparator: () => ({ display: 'none' }),
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            }}
            isSearchable={false}
          />
        );
      }
    },
    { field: 'tipo_id', headerName: 'Tipo ID', width: 100, disableColumnMenu: true },
    { field: 'tecnico_id', headerName: 'Técnico ID', width: 150, disableColumnMenu: true },
    { field: 'usuario_id', headerName: 'Usuário ID', width: 80, disableColumnMenu: true },
    { field: 'status', headerName: 'Status', width: 80, disableColumnMenu: true },
    { field: 'criado_em', headerName: 'Criado em', width: 180, disableColumnMenu: true },
    { field: 'atualizado_em', headerName: 'Atualizado em', width: 180, disableColumnMenu: true },
    {
      field: 'editar',
      headerName: 'Editar',
      width: 80,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        <button
          className="btn btn-link p-0"
          onClick={() => {
            setChamadoSelecionado(params.row);
            const modal = new window.bootstrap.Modal(document.getElementById('modalEditar'));
            modal.show();
          }}
        >
          <i className="bi bi-pencil-square ms-3" style={{ color: '#b5000c', fontSize: '1.2rem' }}></i>
        </button>
      ),
    }
  ];

  const filtrado = chamados.filter((item) =>
    (item.patrimonio || '').toString().toLowerCase().includes(filtroPatrimonio.toLowerCase()) &&
    (item.titulo || '').toLowerCase().includes(filtroTitulo.toLowerCase()) &&
    (item.descricao || '').toLowerCase().includes(filtroDescricoes.toLowerCase()) &&
    (!filtroPrioridade || item.grau_prioridade === filtroPrioridade)
  );

  return (
    <>
      <div className="geral-patrimonios d-flex flex-column">
        <div className="container total-adm flex-grow-1 d-flex flex-column">
          <p className="tituloMedicos mb-3">Controle de Chamados:</p>

          <div className="container-filtro-pacientes mb-5 mb-sm-4 mt-4 mt-sm-0">
            <div className="row g-3">
              <div className="col-12 col-md-6 custom-col-1080">
                <label className="form-label">Filtrar por Nº Patrimônio:</label>
                <div className="input-group borda-filtro-usuario">
                  <button className="btn btn-filtro-adm" type="button">
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
                <label className="form-label">Filtrar por Título:</label>
                <div className="input-group borda-filtro-usuario">
                  <button className="btn btn-filtro-adm" type="button">
                    <i className="bi bi-fonts"></i>
                  </button>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Título"
                    value={filtroTitulo}
                    onChange={(e) => setFiltroTitulo(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-12 col-md-6 custom-col-1080">
                <label className="form-label">Filtrar por Prioridade:</label>
                <div className="input-group-2 borda-filtro-usuario">
                  <button className="btn btn-filtro-adm" type="button">
                    <i className="bi bi-exclamation-triangle"></i>
                  </button>
                  <Select
                    options={prioridadeOptions}
                    value={prioridadeOptions.find(opt => opt.value === filtroPrioridade) || null}
                    onChange={(selectedOption) => setFiltroPrioridade(selectedOption ? selectedOption.value : '')}
                    placeholder="Prioridade"
                    isClearable
                    menuPortalTarget={document.body}
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        backgroundColor: 'transparent',
                        border: 'none',
                        boxShadow: 'none',
                        minHeight: '38px',
                        borderRadius: '20px',
                        color: 'var(--vermelhoEscuro)',
                      }),
                      singleValue: (provided) => ({ ...provided, color: 'var(--vermelhoEscuro)' }),
                      option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isFocused ? 'var(--vermelhoEscuro)' : 'var(--cinza2)',
                        color: '#ffffffff',
                        '&:active': { backgroundColor: 'var(--vermelhoEscuro)' },
                      }),
                      indicatorSeparator: () => ({ display: 'none' }),
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                  />
                </div>
              </div>

              <div className="col-12 col-md-6 custom-col-1080">
                <label className="form-label">Filtrar por Descrição:</label>
                <div className="input-group borda-filtro-usuario">
                  <button className="btn btn-filtro-adm" type="button">
                    <i className="bi bi-journal-text"></i>
                  </button>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Descrição"
                    value={filtroDescricoes}
                    onChange={(e) => setFiltroDescricoes(e.target.value)}
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
                getRowId={(row) => row.id}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[10, 20, 40, 80, 100]}
                disableRowSelectionOnClick
              />
            </Box>
          )}
        </Box>
      </div>

      <ModalEditar chamado={chamadoSelecionado} />
    </>
  );
}