import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import authRotas from './routes/authRotas.js';
import chatRotas from './routes/chatRotas.js';
import passport from './config/ldap.js';
import poolRotas from './routes/poolRotas.js';
import duvidasRotas from './routes/duvidasRotas.js'
import usuariosRotas from './routes/usuariosRotas.js'
import patrimonioRotas from './routes/patrimoniosRotas.js'
import chamadosRotas from './routes/chamadosCriarRota.js';
import chamadosAreaRotas from './routes/chamadosAreaRotas.js';
import meusChamadosRotas from './routes/meusChamadosRotas.js';
import dashboardRotas from './routes/dashboardRotas.js'


// 1. Carrega variáveis de ambiente PRIMEIRO
dotenv.config();

// 2. Configuração básica do Express
const app = express();
const porta = process.env.PORT || 8080;

// 3. Middlewares essenciais com tratamento de erros
try {
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }));
  app.use(express.json());

  app.use(session({
    secret: 'sJYMmuCB2Z187XneUuaOVYTVUlxEOb2K94tFZy370HjOY7T7aiCKvwhNQpQBYL9e',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  }));

  // 4. Inicialização segura do Passport
  if (!passport) {
    throw new Error('Passport não foi importado corretamente');
  }
  app.use(passport.initialize());
  app.use(passport.session());

} catch (err) {
  console.error('Erro na configuração inicial:', err);
  process.exit(1);
}

// 5. Rotas
app.use('/auth', authRotas);
app.use('/uploads', express.static('uploads'));
app.use('/duvidas', duvidasRotas)
app.use('/usuarios', usuariosRotas)
app.use('/patrimonios', patrimonioRotas)
app.use('/chamado', chamadosRotas)
app.use('/chat', chatRotas);
app.use('/pool', poolRotas);
app.use('/chamadosArea', chamadosAreaRotas);
app.use('/meusChamados', meusChamadosRotas);
app.use('/dashboard', dashboardRotas)



app.get('/health', (req, res) => {
  res.status(200).json({ status: 'online' });
});



// 6. Tratamento de erros robusto
process.on('unhandledRejection', (reason, promise) => {
  console.error('Rejeição não tratada em:', promise, 'motivo:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Exceção não capturada:', err);
  process.exit(1);
});

// 7. Inicialização do servidor com verificação
const server = app.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`);
}).on('error', (err) => {
  console.error('Erro ao iniciar:', err);
});

// 8. Encerramento elegante
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Servidor encerrado');
  });
});