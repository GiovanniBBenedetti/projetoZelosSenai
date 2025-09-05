import jwt from 'jsonwebtoken'
import { read, compare } from '../config/database.js'
import { JWT_SECRET } from '../config/jwt.js'

const loginController = async (req, res) => {
  const { username, password } = req.body

  try {
    const usuario = await read('usuarios', `numeroRegistro= '${username}'`)
    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' })
    }

    const senhaCorreta = await compare(password, usuario.senha)

    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: 'Senha Incorreta' })
    }



    const token = jwt.sign(
      {
        id: usuario.id,
        nome: usuario.nome,
        numeroRegistro: usuario.numeroRegistro,
        funcao: usuario.funcao
      },
      JWT_SECRET,
      { expiresIn: "12h" }
    );



    res.json({
      message: "Autenticado com sucesso",
      token,
      user: {
        id: usuario.id,
        numeroRegistro: usuario.numeroRegistro,
        nome: usuario.nome,
        email: usuario.email,
        curso: usuario.descricao,
        funcao: usuario.funcao
      }
    });
  } catch (err) {
    console.error('Erro ao fazer login: ', err)
    res.status(500).json({ mensagem: 'Erro ao fazer login' })
  }
}

export { loginController }




