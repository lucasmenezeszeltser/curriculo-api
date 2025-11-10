const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuração do PostgreSQL com Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Testar conexão com o banco
pool.connect((err, client, release) => {
  if (err) {
    console.error('Erro ao conectar com o banco:', err);
  } else {
    console.log('Conectado ao PostgreSQL com Neon!');
    release();
  }
});

// Importar rotas
const profissionaisRoutes = require('./routes/profissionais');
app.use('/api', profissionaisRoutes(pool));

// Rota inicial
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de Currículos Profissionais funcionando!',
    endpoints: {
      profissionais: '/api/profissionais',
      experiencias: '/api/experiencias',
      formacao: '/api/formacao',
      habilidades: '/api/habilidades',
      idiomas: '/api/idiomas',
      especiais: {
        profissionais_disponiveis: '/api/profissionais/disponiveis',
        por_nivel: '/api/profissionais/nivel/:nivel',
        curriculo_completo: '/api/curriculo/:profissional_id',
        habilidades_por_categoria: '/api/habilidades/categoria/:categoria'
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});