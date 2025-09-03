import express from 'express';
import passport from '../config/ldap.js';
import { loginSucessoController } from "../controllers/AuthController.js"
const router = express.Router();

router.post('/login', (req, res, next) => {
  passport.authenticate('ldapauth', { session: true }, (err, user, info) => {
    try {
      if (err) {
        return res.status(500).json({ error: 'Erro interno no servidor' });
      }

      if (!user) {
        return res.status(401).json({ error: info?.message || 'Autenticação falhou' });
      }

      req.logIn(user, async (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ error: 'Erro ao criar sessão' });
        }

        console.log(user);

        await loginSucessoController(req, res); 
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro inesperado no servidor' });
    }
  })(req, res, next);
});



router.post('/logout', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Nenhum usuário autenticado' });
  }

  console.log('Usuário deslogando:', req.user?.displayName);

  req.logout((err) => {
    if (err) {
      console.error('Erro no logout:', err);
      return res.status(500).json({ error: 'Erro ao realizar logout' });
    }

    // Destrói a sessão completamente
    req.session.destroy((destroyErr) => {
      if (destroyErr) {
        console.error('Erro ao destruir sessão:', destroyErr);
        return res.status(500).json({ error: 'Erro ao encerrar sessão' });
      }

      res.clearCookie('connect.sid'); // Remove o cookie de sessão
      res.json({ message: 'Logout realizado com sucesso' });
    });
  });
});

// Rota para verificar autenticação
router.get('/check-auth', (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({
      authenticated: true,
      user: {
        username: req.user.username,
        displayName: req.user.displayName,
      },
    });
  }
  res.status(401).json({ authenticated: false });
});



export default router;
