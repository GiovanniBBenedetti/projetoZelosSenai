import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';

export default function Toast({ conteudo, tipo }) {
  useEffect(() => {
    if (tipo === 'ok') {
      toast.success(conteudo || 'Requisição realizada !!!');
    } else {
      toast.error(conteudo || 'Falha na requisição');
    }
  }, [conteudo, tipo]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        pauseOnHover={false}
      />
    </>
  );
}