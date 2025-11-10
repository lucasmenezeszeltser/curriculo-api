const express = require('express');

module.exports = (pool) => {
  const router = express.Router();

  // ===== ENTIDADE PROFISSIONAIS =====
  
  // GET todos os profissionais
  router.get('/profissionais', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM profissionais');
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET profissional por ID
  router.get('/profissionais/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM profissionais WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Profissional não encontrado' });
      }
      
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST criar profissional
  router.post('/profissionais', async (req, res) => {
    try {
      const {
        nome_completo, email, telefone, cargo_atual, nivel_experiencia,
        localizacao, linkedin_url, github_url, salario_pretendido,
        disponivel_contratacao, resumo_profissional
      } = req.body;
      
      const result = await pool.query(
        `INSERT INTO profissionais (
          nome_completo, email, telefone, cargo_atual, nivel_experiencia,
          localizacao, linkedin_url, github_url, salario_pretendido,
          disponivel_contratacao, resumo_profissional
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
        [
          nome_completo, email, telefone, cargo_atual, nivel_experiencia,
          localizacao, linkedin_url, github_url, salario_pretendido,
          disponivel_contratacao, resumo_profissional
        ]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // PUT atualizar profissional
  router.put('/profissionais/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const {
        nome_completo, email, telefone, cargo_atual, nivel_experiencia,
        localizacao, linkedin_url, github_url, salario_pretendido,
        disponivel_contratacao, resumo_profissional
      } = req.body;
      
      const result = await pool.query(
        `UPDATE profissionais SET 
          nome_completo = $1, email = $2, telefone = $3, cargo_atual = $4, 
          nivel_experiencia = $5, localizacao = $6, linkedin_url = $7, 
          github_url = $8, salario_pretendido = $9, 
          disponivel_contratacao = $10, resumo_profissional = $11 
        WHERE id = $12 RETURNING *`,
        [
          nome_completo, email, telefone, cargo_atual, nivel_experiencia,
          localizacao, linkedin_url, github_url, salario_pretendido,
          disponivel_contratacao, resumo_profissional, id
        ]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Profissional não encontrado' });
      }
      
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // DELETE profissional
  router.delete('/profissionais/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM profissionais WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Profissional não encontrado' });
      }
      
      res.json({ message: 'Profissional deletado com sucesso' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // ===== ENTIDADE EXPERIÊNCIAS =====
  
  // GET todas as experiências
  router.get('/experiencias', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT e.*, p.nome_completo as profissional_nome 
        FROM experiencias e 
        JOIN profissionais p ON e.profissional_id = p.id
      `);
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET experiências por profissional
  router.get('/experiencias/profissional/:profissional_id', async (req, res) => {
    try {
      const { profissional_id } = req.params;
      const result = await pool.query(
        'SELECT * FROM experiencias WHERE profissional_id = $1 ORDER BY data_inicio DESC',
        [profissional_id]
      );
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST criar experiência
  router.post('/experiencias', async (req, res) => {
    try {
      const { profissional_id, empresa, cargo, data_inicio, data_fim, atual, descricao, tecnologias } = req.body;
      const result = await pool.query(
        'INSERT INTO experiencias (profissional_id, empresa, cargo, data_inicio, data_fim, atual, descricao, tecnologias) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [profissional_id, empresa, cargo, data_inicio, data_fim, atual, descricao, tecnologias]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // PUT atualizar experiência
  router.put('/experiencias/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { empresa, cargo, data_inicio, data_fim, atual, descricao, tecnologias } = req.body;
      const result = await pool.query(
        'UPDATE experiencias SET empresa = $1, cargo = $2, data_inicio = $3, data_fim = $4, atual = $5, descricao = $6, tecnologias = $7 WHERE id = $8 RETURNING *',
        [empresa, cargo, data_inicio, data_fim, atual, descricao, tecnologias, id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Experiência não encontrada' });
      }
      
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // DELETE experiência
  router.delete('/experiencias/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM experiencias WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Experiência não encontrada' });
      }
      
      res.json({ message: 'Experiência deletada com sucesso' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // ===== ENTIDADE FORMAÇÃO =====
  
  // GET toda a formação
  router.get('/formacao', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT f.*, p.nome_completo as profissional_nome 
        FROM formacao f 
        JOIN profissionais p ON f.profissional_id = p.id
      `);
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET formação por profissional
  router.get('/formacao/profissional/:profissional_id', async (req, res) => {
    try {
      const { profissional_id } = req.params;
      const result = await pool.query(
        'SELECT * FROM formacao WHERE profissional_id = $1 ORDER BY data_inicio DESC',
        [profissional_id]
      );
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST criar formação
  router.post('/formacao', async (req, res) => {
    try {
      const { profissional_id, instituicao, curso, nivel, data_inicio, data_conclusao, concluido } = req.body;
      const result = await pool.query(
        'INSERT INTO formacao (profissional_id, instituicao, curso, nivel, data_inicio, data_conclusao, concluido) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [profissional_id, instituicao, curso, nivel, data_inicio, data_conclusao, concluido]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // PUT atualizar formação
  router.put('/formacao/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { instituicao, curso, nivel, data_inicio, data_conclusao, concluido } = req.body;
      const result = await pool.query(
        'UPDATE formacao SET instituicao = $1, curso = $2, nivel = $3, data_inicio = $4, data_conclusao = $5, concluido = $6 WHERE id = $7 RETURNING *',
        [instituicao, curso, nivel, data_inicio, data_conclusao, concluido, id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Formação não encontrada' });
      }
      
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // DELETE formação
  router.delete('/formacao/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM formacao WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Formação não encontrada' });
      }
      
      res.json({ message: 'Formação deletada com sucesso' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // ===== ENTIDADE HABILIDADES =====
  
  // GET todas as habilidades
  router.get('/habilidades', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT h.*, p.nome_completo as profissional_nome 
        FROM habilidades h 
        JOIN profissionais p ON h.profissional_id = p.id
      `);
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET habilidades por profissional
  router.get('/habilidades/profissional/:profissional_id', async (req, res) => {
    try {
      const { profissional_id } = req.params;
      const result = await pool.query(
        'SELECT * FROM habilidades WHERE profissional_id = $1 ORDER BY nivel_proficiencia DESC',
        [profissional_id]
      );
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST criar habilidade
  router.post('/habilidades', async (req, res) => {
    try {
      const { profissional_id, tecnologia, categoria, nivel_proficiencia, anos_experiencia, destaque } = req.body;
      const result = await pool.query(
        'INSERT INTO habilidades (profissional_id, tecnologia, categoria, nivel_proficiencia, anos_experiencia, destaque) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [profissional_id, tecnologia, categoria, nivel_proficiencia, anos_experiencia, destaque]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // PUT atualizar habilidade
  router.put('/habilidades/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { tecnologia, categoria, nivel_proficiencia, anos_experiencia, destaque } = req.body;
      const result = await pool.query(
        'UPDATE habilidades SET tecnologia = $1, categoria = $2, nivel_proficiencia = $3, anos_experiencia = $4, destaque = $5 WHERE id = $6 RETURNING *',
        [tecnologia, categoria, nivel_proficiencia, anos_experiencia, destaque, id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Habilidade não encontrada' });
      }
      
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // DELETE habilidade
  router.delete('/habilidades/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM habilidades WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Habilidade não encontrada' });
      }
      
      res.json({ message: 'Habilidade deletada com sucesso' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // ===== ENTIDADE IDIOMAS =====
  
  // GET todos os idiomas
  router.get('/idiomas', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT i.*, p.nome_completo as profissional_nome 
        FROM idiomas i 
        JOIN profissionais p ON i.profissional_id = p.id
      `);
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET idiomas por profissional
  router.get('/idiomas/profissional/:profissional_id', async (req, res) => {
    try {
      const { profissional_id } = req.params;
      const result = await pool.query(
        'SELECT * FROM idiomas WHERE profissional_id = $1',
        [profissional_id]
      );
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST criar idioma
  router.post('/idiomas', async (req, res) => {
    try {
      const { profissional_id, idioma, nivel } = req.body;
      const result = await pool.query(
        'INSERT INTO idiomas (profissional_id, idioma, nivel) VALUES ($1, $2, $3) RETURNING *',
        [profissional_id, idioma, nivel]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // PUT atualizar idioma
  router.put('/idiomas/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { idioma, nivel } = req.body;
      const result = await pool.query(
        'UPDATE idiomas SET idioma = $1, nivel = $2 WHERE id = $3 RETURNING *',
        [idioma, nivel, id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Idioma não encontrado' });
      }
      
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // DELETE idioma
  router.delete('/idiomas/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM idiomas WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Idioma não encontrado' });
      }
      
      res.json({ message: 'Idioma deletado com sucesso' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // ===== ROTAS ESPECIAIS =====
  
  // GET profissionais disponíveis para contratação
  router.get('/profissionais/disponiveis', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM profissionais WHERE disponivel_contratacao = true');
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET profissionais por nível de experiência
  router.get('/profissionais/nivel/:nivel', async (req, res) => {
    try {
      const { nivel } = req.params;
      const result = await pool.query(
        'SELECT * FROM profissionais WHERE nivel_experiencia = $1',
        [nivel]
      );
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET currículo completo do profissional
  router.get('/curriculo/:profissional_id', async (req, res) => {
    try {
      const { profissional_id } = req.params;
      
      const [profissional, experiencias, formacao, habilidades, idiomas] = await Promise.all([
        pool.query('SELECT * FROM profissionais WHERE id = $1', [profissional_id]),
        pool.query('SELECT * FROM experiencias WHERE profissional_id = $1 ORDER BY data_inicio DESC', [profissional_id]),
        pool.query('SELECT * FROM formacao WHERE profissional_id = $1 ORDER BY data_inicio DESC', [profissional_id]),
        pool.query('SELECT * FROM habilidades WHERE profissional_id = $1 ORDER BY nivel_proficiencia DESC', [profissional_id]),
        pool.query('SELECT * FROM idiomas WHERE profissional_id = $1', [profissional_id])
      ]);

      if (profissional.rows.length === 0) {
        return res.status(404).json({ error: 'Profissional não encontrado' });
      }

      res.json({
        profissional: profissional.rows[0],
        experiencias: experiencias.rows,
        formacao: formacao.rows,
        habilidades: habilidades.rows,
        idiomas: idiomas.rows
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET habilidades por categoria
  router.get('/habilidades/categoria/:categoria', async (req, res) => {
    try {
      const { categoria } = req.params;
      const result = await pool.query(
        'SELECT h.*, p.nome_completo as profissional_nome FROM habilidades h JOIN profissionais p ON h.profissional_id = p.id WHERE h.categoria = $1',
        [categoria]
      );
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};