import { obterUsuario, criarUsuario } from "../models/Usuarios.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwt.js";
import generateHashedPassword from '../hashPassword.js'

const loginSucesso = async (req, res) => {
  try {
    const email = req.user.userPrincipalName;
    const nome = req.user.displayName;
    const numeroRegistro = req.user.sAMAccountName; 
    const password = req.body.password




    const senha = await generateHashedPassword(password);
    let usuario = await obterUsuario(email);

    if (!usuario || usuario.length === 0) {

      const usuarioData = {
        email,
        nome,
        senha,
        numeroRegistro
      };

      await criarUsuario(usuarioData);


      usuario = await obterUsuario(email);
    }



    const token = jwt.sign(
      { id: usuario.numeroRegistro, nome: usuario.nome, email: usuario.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      message: "Autenticado com sucesso",
      token,
      user: {
        numeroRegistro: usuario.numeroRegistro,
        displayName: usuario.nome,
        email: usuario.email,
      }
    });
  } catch (error) {
    console.error("Erro ao criar ou verificar usuário no banco:", error);
    return res.status(500).json({ error: "Erro interno ao salvar usuário" });
  }
};



export {loginSucesso};
