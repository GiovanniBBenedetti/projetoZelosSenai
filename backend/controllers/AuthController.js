import jwt from 'jsonwebtoken'
import { read, compare } from '../config/database.js'
import { JWT_SECRET } from '../config/jwt.js'

const loginController = async (req, res) => {
  const { numeroRegistro, senha } = req.body

  try {
    const usuario = await read('usuarios', `numeroRegistro= '${numeroRegistro}'`)
    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' })
    }

    const senhaCorreta = await compare(senha, usuario.senha)

    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: 'Senha Incorreta' })
    }

    const token = jwt.sign(

      {
        id: usuario.id,
        nome: usuario.nome,
        numeroRegistro: usuario.numeroRegistro,
        funcao: usuario.funcao

      }, JWT_SECRET, { expiresIn: '1h' })
    res.json({
      mensagem: 'Login realizado com sucesso',
      token,
      user: {
        id: usuario.id,
        nome: usuario.nome,
        numeroRegistro: usuario.numeroRegistro,
        funcao: usuario.funcao,
        descricao: usuario.descricao
      }
    })
  } catch (err) {
    console.error('Erro ao fazer login: ', err)
    res.status(500).json({ mensagem: 'Erro ao fazer login' })
  }
}

export { loginController }