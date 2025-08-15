const dashboard =  (req, res) => {
    res.json({ mensagem: `Bem-vindo ao painel admin, ${req.usuario.nome}` });
  };
  
  export  {dashboard}