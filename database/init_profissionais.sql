-- Tabela de Profissionais
CREATE TABLE IF NOT EXISTS profissionais (
    id SERIAL PRIMARY KEY,
    nome_completo VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    cargo_atual VARCHAR(100) NOT NULL,
    nivel_experiencia VARCHAR(20) CHECK (nivel_experiencia IN ('Júnior', 'Pleno', 'Sênior', 'Especialista')),
    localizacao VARCHAR(100),
    linkedin_url VARCHAR(200),
    github_url VARCHAR(200),
    salario_pretendido DECIMAL(10,2),
    disponivel_contratacao BOOLEAN DEFAULT true,
    resumo_profissional TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Experiências Profissionais
CREATE TABLE IF NOT EXISTS experiencias (
    id SERIAL PRIMARY KEY,
    profissional_id INTEGER REFERENCES profissionais(id) ON DELETE CASCADE,
    empresa VARCHAR(100) NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    atual BOOLEAN DEFAULT false,
    descricao TEXT,
    tecnologias TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Formação Acadêmica
CREATE TABLE IF NOT EXISTS formacao (
    id SERIAL PRIMARY KEY,
    profissional_id INTEGER REFERENCES profissionais(id) ON DELETE CASCADE,
    instituicao VARCHAR(100) NOT NULL,
    curso VARCHAR(100) NOT NULL,
    nivel VARCHAR(50) CHECK (nivel IN ('Técnico', 'Graduação', 'Pós-Graduação', 'Mestrado', 'Doutorado', 'Certificação')),
    data_inicio DATE NOT NULL,
    data_conclusao DATE,
    concluido BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Habilidades Técnicas
CREATE TABLE IF NOT EXISTS habilidades (
    id SERIAL PRIMARY KEY,
    profissional_id INTEGER REFERENCES profissionais(id) ON DELETE CASCADE,
    tecnologia VARCHAR(50) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    nivel_proficiencia INTEGER CHECK (nivel_proficiencia >= 1 AND nivel_proficiencia <= 5),
    anos_experiencia DECIMAL(3,1),
    destaque BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Idiomas
CREATE TABLE IF NOT EXISTS idiomas (
    id SERIAL PRIMARY KEY,
    profissional_id INTEGER REFERENCES profissionais(id) ON DELETE CASCADE,
    idioma VARCHAR(50) NOT NULL,
    nivel VARCHAR(20) CHECK (nivel IN ('Básico', 'Intermediário', 'Avançado', 'Fluente', 'Nativo')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir dados iniciais para DOIS profissionais

-- Profissional 1: Desenvolvedor Backend
INSERT INTO profissionais (
    nome_completo, email, telefone, cargo_atual, nivel_experiencia, 
    localizacao, linkedin_url, github_url, salario_pretendido, 
    disponivel_contratacao, resumo_profissional
) VALUES (
    'Ricardo Silva',
    'ricardo.silva@dev.com',
    '(11) 98888-9999',
    'Desenvolvedor Backend Pleno',
    'Pleno',
    'São Paulo, SP',
    'https://linkedin.com/in/ricardosilva',
    'https://github.com/ricardosilva',
    7500.00,
    true,
    'Desenvolvedor Backend com 4 anos de experiência em Node.js, Python e arquitetura de microserviços. Especializado em APIs REST, bancos de dados relacionais e soluções escaláveis.'
);

-- Profissional 2: Cientista de Dados
INSERT INTO profissionais (
    nome_completo, email, telefone, cargo_atual, nivel_experiencia, 
    localizacao, linkedin_url, github_url, salario_pretendido, 
    disponivel_contratacao, resumo_profissional
) VALUES (
    'Mariana Costa',
    'mariana.costa@data.com',
    '(21) 97777-8888',
    'Cientista de Dados Sênior',
    'Sênior',
    'Rio de Janeiro, RJ',
    'https://linkedin.com/in/marianacosta',
    'https://github.com/marianacosta',
    12000.00,
    true,
    'Cientista de Dados com 6 anos de experiência em machine learning, análise preditiva e big data. Domínio de Python, R, SQL e ferramentas de visualização de dados.'
);

-- Experiências do Ricardo
INSERT INTO experiencias (
    profissional_id, empresa, cargo, data_inicio, data_fim, atual, descricao, tecnologias
) VALUES 
(
    1,
    'Tech Solutions SA',
    'Desenvolvedor Backend Pleno',
    '2022-03-01',
    NULL,
    true,
    'Desenvolvimento e manutenção de APIs REST para sistema de e-commerce. Implementação de microserviços e integração com sistemas de pagamento.',
    ARRAY['Node.js', 'Express', 'PostgreSQL', 'Redis', 'Docker', 'AWS']
),
(
    1,
    'Startup Inova',
    'Desenvolvedor Backend Júnior',
    '2020-01-15',
    '2022-02-28',
    false,
    'Desenvolvimento de features para aplicação web. Participação em squad ágil e code reviews.',
    ARRAY['JavaScript', 'Node.js', 'MongoDB', 'React']
);

-- Experiências da Mariana
INSERT INTO experiencias (
    profissional_id, empresa, cargo, data_inicio, data_fim, atual, descricao, tecnologias
) VALUES 
(
    2,
    'Data Corp Analytics',
    'Cientista de Dados Sênior',
    '2021-06-01',
    NULL,
    true,
    'Liderança de projetos de machine learning. Desenvolvimento de modelos preditivos e análise de dados complexos.',
    ARRAY['Python', 'TensorFlow', 'PyTorch', 'SQL', 'Tableau', 'Spark']
),
(
    2,
    'Research Lab',
    'Analista de Dados',
    '2018-08-01',
    '2021-05-31',
    false,
    'Análise estatística de dados de pesquisa. Criação de dashboards e relatórios analíticos.',
    ARRAY['R', 'Python', 'Excel', 'Power BI']
);

-- Formação do Ricardo
INSERT INTO formacao (
    profissional_id, instituicao, curso, nivel, data_inicio, data_conclusao, concluido
) VALUES 
(
    1,
    'Universidade de São Paulo',
    'Ciência da Computação',
    'Graduação',
    '2016-01-01',
    '2019-12-15',
    true
),
(
    1,
    'Alura',
    'Arquitetura de Software',
    'Certificação',
    '2021-03-01',
    '2021-06-01',
    true
);

-- Formação da Mariana
INSERT INTO formacao (
    profissional_id, instituicao, curso, nivel, data_inicio, data_conclusao, concluido
) VALUES 
(
    2,
    'Universidade Federal do Rio de Janeiro',
    'Estatística',
    'Graduação',
    '2014-01-01',
    '2018-12-20',
    true
),
(
    2,
    'MIT',
    'Data Science and Machine Learning',
    'Pós-Graduação',
    '2019-01-15',
    '2020-12-20',
    true
);

-- Habilidades do Ricardo
INSERT INTO habilidades (
    profissional_id, tecnologia, categoria, nivel_proficiencia, anos_experiencia, destaque
) VALUES 
(1, 'Node.js', 'Backend', 4, 3.5, true),
(1, 'PostgreSQL', 'Banco de Dados', 4, 3.0, true),
(1, 'Express', 'Backend', 4, 3.0, false),
(1, 'Docker', 'DevOps', 3, 2.0, false),
(1, 'AWS', 'Cloud', 3, 1.5, false),
(1, 'JavaScript', 'Linguagem', 4, 4.0, true);

-- Habilidades da Mariana
INSERT INTO habilidades (
    profissional_id, tecnologia, categoria, nivel_proficiencia, anos_experiencia, destaque
) VALUES 
(2, 'Python', 'Linguagem', 5, 5.0, true),
(2, 'TensorFlow', 'Machine Learning', 4, 3.0, true),
(2, 'SQL', 'Banco de Dados', 5, 5.0, true),
(2, 'Tableau', 'Visualização', 4, 3.5, false),
(2, 'R', 'Linguagem', 4, 4.0, false),
(2, 'Spark', 'Big Data', 3, 2.0, false);

-- Idiomas do Ricardo
INSERT INTO idiomas (profissional_id, idioma, nivel) VALUES
(1, 'Português', 'Nativo'),
(1, 'Inglês', 'Avançado'),
(1, 'Espanhol', 'Intermediário');

-- Idiomas da Mariana
INSERT INTO idiomas (profissional_id, idioma, nivel) VALUES
(2, 'Português', 'Nativo'),
(2, 'Inglês', 'Fluente'),
(2, 'Francês', 'Básico');