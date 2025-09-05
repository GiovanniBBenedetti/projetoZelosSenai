'use client';
import { useState, useEffect } from 'react';
import { getCookie } from 'cookies-next';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Select from 'react-select';
import './styleUserADM.css';

const statusOptions = [
  { value: 'ativo', label: 'Ativo' },
  { value: 'inativo', label: 'Inativo' }
];

const columns = [
  { field: 'id', headerName: 'ID', width: 50, disableColumnMenu: true },
  { field: 'nome', headerName: 'Nome', width: 200, disableColumnMenu: true },
  { field: 'numeroRegistro', headerName: 'Nº Registro', width: 120, disableColumnMenu: true },
  { field: 'email', headerName: 'Email', width: 200, disableColumnMenu: true },
  { field: 'funcao', headerName: 'Função', width: 120, disableColumnMenu: true },
  { field: 'criadoEm', headerName: 'Criado em', width: 120, disableColumnMenu: true },
  { field: 'atualizadoEm', headerName: 'Atualizado em', width: 120, disableColumnMenu: true },
  {
    field: 'status',
    headerName: 'Status',
    width: 150,
    disableColumnMenu: true,
    renderCell: (params) => {
      const token = getCookie('token');

      const handleChange = async (selectedOption) => {
        try {
          await fetch(`http://localhost:8080/usuarios/${params.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status: selectedOption.value }),
          });
          params.api.updateRows([{ id: params.id, status: selectedOption.value }]);
        } catch (err) {
          console.error("Erro ao atualizar status:", err);
        }
      };

      return (
        <Select
          options={statusOptions}
          value={statusOptions.find(opt => opt.value === params.value)}
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
            singleValue: (provided) => ({
              ...provided,
              color: '#000000',
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isFocused ? '#8e0009' : '#b5000c',
              color: '#fff',
              '&:active': {
                backgroundColor: '#8e0009',
              },
            }),
            indicatorSeparator: () => ({
              display: 'none',
            }),
            menuPortal: (base) => ({ ...base, zIndex: 9999 }), // mantém o select acima da tabela
          }}
          isSearchable={false}
        />

      );
    }
  }





];

export default function TabelaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroRegistro, setFiltroRegistro] = useState('');
  const [filtroFuncao, setFiltroFuncao] = useState('');
  const [filtroEmail, setFiltroEmail] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    async function fetchUsuarios() {
      try {
        const token = getCookie('token');
        const response = await fetch('http://localhost:8080/usuarios', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        const mapped = data.map((usuario) => {
          return {
            id: usuario.id,
            nome: usuario.nome,
            numeroRegistro: String(usuario.numeroRegistro),
            email: usuario.email,
            funcao: usuario.funcao || '—',
            criadoEm: new Date(usuario.criado_em).toLocaleDateString('pt-BR'),
            atualizadoEm: new Date(usuario.atualizado_em).toLocaleDateString('pt-BR'),
            status: usuario.status
          };
        });


        setUsuarios(mapped);
      } catch (err) {
        console.error('Erro ao buscar usuários:', err);
      }
    }

    fetchUsuarios();
  }, []);


  const filtrado = usuarios.filter((item) =>
    item.nome.toLowerCase().includes(filtroNome.toLowerCase()) &&
    item.numeroRegistro.toLowerCase().includes(filtroRegistro.toLowerCase()) &&
    item.funcao.toLowerCase().includes(filtroFuncao.toLowerCase()) &&
    (item.email || '').toLowerCase().includes(filtroEmail.toLowerCase())
  );

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  return (
    <>

      <div className="geral-patrimonios d-flex flex-column">
        <div className="container total-adm flex-grow-1 d-flex flex-column">
          <p className="tituloMedicos mb-3">Controle de Usuários:</p>


          <div className="container-filtro-pacientes mb-5 mb-sm-4 mt-4 mt-sm-0">
            <div className="row g-3">
              <div className="col-12 col-md-6 custom-col-1080">
                <label className="form-label">Filtrar por Nome:</label>
                <div className="input-group borda-filtro-usuario">
                  <button className="btn btn-filtro-adm" type="button">
                    <i className="bi bi-person"></i>
                  </button>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nome"
                    value={filtroNome}
                    onChange={(e) => setFiltroNome(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-12 col-md-6 custom-col-1080">
                <label className="form-label">Filtrar por Nº Registro:</label>
                <div className="input-group borda-filtro-usuario">
                  <button className="btn btn-filtro-adm" type="button">
                    <i className="bi bi-upc"></i>
                  </button>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nº Registro"
                    value={filtroRegistro}
                    onChange={(e) => setFiltroRegistro(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-12 col-md-6 custom-col-1080">
                <label className="form-label">Filtrar por Função:</label>
                <div className="input-group borda-filtro-usuario">
                  <button className="btn btn-filtro-adm" type="button">
                    <i className="bi bi-briefcase"></i>
                  </button>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Função"
                    value={filtroFuncao}
                    onChange={(e) => setFiltroFuncao(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-12 col-md-6 custom-col-1080">
                <label className="form-label">Filtrar por Email:</label>
                <div className="input-group borda-filtro-usuario">
                  <button className="btn btn-filtro-adm" type="button">
                    <i className="bi bi-envelope"></i>
                  </button>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Email"
                    value={filtroEmail}
                    onChange={(e) => setFiltroEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div className="geral-table-patrimonio flex-grow-1 d-flex ps-4 pe-4 pb-4">
        <Box sx={{ flex: 1, height: '100%', width: '100%' }}>
          {mounted && (
            <DataGrid
              rows={filtrado}
              columns={columns}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[10, 40, 80, 100, 200]}
              getRowId={(row) => row.id}
              disableRowSelectionOnClick
              sx={{
                '& .MuiDataGrid-virtualScroller': {
                  overflowX: 'auto',
                },
                '& .MuiDataGrid-columnHeaders': {
                  width: '100%',
                },
                '& .MuiDataGrid-cell': {
                  whiteSpace: 'normal',
                  wordWrap: 'break-word',
                }
              }}
            />
          )}
        </Box>
      </div>

    </>
  );
}
