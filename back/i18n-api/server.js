const express = require('express');
const Redis = require('redis');
const cors = require('cors');
const helmet = require('helmet');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Importar fetch para Node.js (versões < 18)
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'InvestPro i18n API',
      description: 'API para gerenciamento de traduções e cotações de câmbio',
      version: '1.0.0',
      contact: {
        name: 'InvestPro Team',
        email: 'dev@investpro.com'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' ? 'https://invest-pro-42u1.vercel.app' : 'http://localhost:3000',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    tags: [
      { name: 'Health', description: 'Endpoints de status da API' },
      { name: 'Translations', description: 'Endpoints de gerenciamento de traduções' },
      { name: 'Exchange Rate', description: 'Endpoints de cotações de câmbio' }
    ],
    components: {
      schemas: {
        Translation: {
          type: 'object',
          properties: {
            title: { type: 'string', example: 'InvestPro' },
            subtitle: { type: 'string', example: 'Smart Investment Platform' },
            language: { type: 'string', example: 'Language' },
            hero: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                subtitle: { type: 'string' },
                cta: { type: 'string' },
                learn_more: { type: 'string' }
              }
            }
          }
        },
        ExchangeRate: {
          type: 'object',
          properties: {
            rate: { type: 'number', example: 5.4797 },
            high: { type: 'number', example: 5.495 },
            low: { type: 'number', example: 5.45961 },
            variation: { type: 'number', example: 0.192716 },
            timestamp: { type: 'string', format: 'date-time' },
            name: { type: 'string', example: 'Dólar Americano/Real Brasileiro' },
            code: { type: 'string', example: 'USD' },
            codein: { type: 'string', example: 'BRL' }
          }
        }
      }
    }
  },
  apis: ['./server.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
}));
app.use(cors({
  origin: process.env.CORS_ORIGIN || true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Conectar ao Redis (Vercel KV ou Redis externo)
let redisClient;
let isRedisConnected = false;

async function initRedis() {
  try {
    if (process.env.KV_URL) {
      // Vercel KV
      redisClient = Redis.createClient({
        url: process.env.KV_URL,
        socket: {
          tls: true,
          rejectUnauthorized: false
        }
      });
      console.log('✅ Connected to Vercel KV');
    } else if (process.env.REDIS_URL) {
      // Redis externo
      redisClient = Redis.createClient({
        url: process.env.REDIS_URL,
        socket: {
          tls: process.env.REDIS_TLS === 'true',
          rejectUnauthorized: false
        }
      });
      console.log('✅ Connected to external Redis');
    } else {
      // Modo demo sem Redis
      redisClient = null;
      console.log('⚠️  No Redis connection, running in demo mode');
      return;
    }

    if (redisClient) {
      redisClient.on('error', (err) => {
        console.log('Redis Client Error:', err);
        isRedisConnected = false;
      });
      
      redisClient.on('connect', () => {
        console.log('Connected to Redis');
        isRedisConnected = true;
      });
      
      redisClient.on('ready', () => {
        console.log('Redis ready');
        isRedisConnected = true;
      });

      await redisClient.connect();
      await initializeTranslations();
    }
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
    isRedisConnected = false;
  }
}

// Inicializar traduções padrão
const defaultTranslations = {
  en: {
    title: "InvestPro",
    subtitle: "Smart Investment Platform",
    language: "Language",
    hero: {
      title: "Invest Smart, Grow Faster",
      subtitle: "Access the best investment opportunities with real-time market data and expert analysis",
      cta: "Start Investing",
      learn_more: "Learn More"
    },
    exchange: {
      title: "USD/BRL Exchange Rate",
      last_update: "Last update",
      high: "High",
      low: "Low",
      variation: "Variation"
    },
    features: {
      title: "Why Choose InvestPro?",
      realtime: {
        title: "Real-time Data",
        description: "Access live market data and exchange rates updated every minute"
      },
      analysis: {
        title: "Expert Analysis",
        description: "Get insights from our team of financial experts and market analysts"
      },
      security: {
        title: "Maximum Security",
        description: "Your investments are protected with bank-level security and encryption"
      }
    },
    cta: {
      title: "Ready to Start Investing?",
      description: "Join thousands of investors who trust InvestPro for their financial growth",
      button: "Open Account"
    },
    footer: {
      rights: "All rights reserved",
      terms: "Terms of Service",
      privacy: "Privacy Policy",
      contact: "Contact"
    }
  },
  pt: {
    title: "InvestPro",
    subtitle: "Plataforma de Investimentos Inteligente",
    language: "Idioma",
    hero: {
      title: "Invista Inteligente, Cresça Mais Rápido",
      subtitle: "Acesse as melhores oportunidades de investimento com dados de mercado em tempo real e análises especializadas",
      cta: "Começar a Investir",
      learn_more: "Saiba Mais"
    },
    exchange: {
      title: "Cotação USD/BRL",
      last_update: "Última atualização",
      high: "Máxima",
      low: "Mínima",
      variation: "Variação"
    },
    features: {
      title: "Por que Escolher a InvestPro?",
      realtime: {
        title: "Dados em Tempo Real",
        description: "Acesse dados de mercado ao vivo e cotações atualizadas a cada minuto"
      },
      analysis: {
        title: "Análise Especializada",
        description: "Obtenha insights de nossa equipe de especialistas financeiros e analistas de mercado"
      },
      security: {
        title: "Máxima Segurança",
        description: "Seus investimentos são protegidos com segurança e criptografia de nível bancário"
      }
    },
    cta: {
      title: "Pronto para Começar a Investir?",
      description: "Junte-se a milhares de investidores que confiam na InvestPro para seu crescimento financeiro",
      button: "Abrir Conta"
    },
    footer: {
      rights: "Todos os direitos reservados",
      terms: "Termos de Serviço",
      privacy: "Política de Privacidade",
      contact: "Contato"
    }
  }
};

// Inicializar Redis com traduções padrão
async function initializeTranslations() {
  try {
    if (!redisClient || !isRedisConnected) {
      console.log('⚠️  Redis não configurado, pulando inicialização de traduções padrão.');
      return;
    }

    // Verificar se já existem traduções
    const hasTranslations = await redisClient.exists('i18n:en');
    
    if (!hasTranslations) {
      console.log('Inicializando traduções padrão...');
      
      // Salvar traduções no Redis
      for (const [lang, translations] of Object.entries(defaultTranslations)) {
        await redisClient.set(`i18n:${lang}`, JSON.stringify(translations));
      }
      
      console.log('✅ Traduções inicializadas com sucesso!');
    } else {
      console.log('✅ Traduções já existem no Redis');
    }
  } catch (error) {
    console.error('❌ Erro ao inicializar traduções:', error);
  }
}

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Rotas da API

/**
 * @swagger
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Health Check
 *     description: Verifica o status da API e conexão com Redis
 *     responses:
 *       200:
 *         description: API funcionando normalmente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 redis:
 *                   type: string
 *                   example: connected
 *                 environment:
 *                   type: string
 *                   example: production
 */
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    redis: isRedisConnected ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development'
  });
});

/**
 * @swagger
 * /api/translations/{lang}:
 *   get:
 *     tags: [Translations]
 *     summary: Obter traduções de um idioma
 *     description: Retorna as traduções para o idioma especificado
 *     parameters:
 *       - in: path
 *         name: lang
 *         required: true
 *         schema:
 *           type: string
 *           enum: [en, pt]
 *         description: Código do idioma (en para inglês, pt para português)
 *     responses:
 *       200:
 *         description: Traduções encontradas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Translation'
 *       404:
 *         description: Idioma não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Idioma não encontrado
 *       503:
 *         description: Serviço indisponível
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Serviço de traduções indisponível
 */
app.get('/api/translations/:lang', async (req, res) => {
  try {
    if (!redisClient || !isRedisConnected) {
      return res.status(503).json({ 
        error: 'Serviço de traduções indisponível',
        message: 'Redis não está conectado'
      });
    }

    const { lang } = req.params;
    const translations = await redisClient.get(`i18n:${lang}`);
    
    if (!translations) {
      return res.status(404).json({ error: 'Idioma não encontrado' });
    }
    
    res.json(JSON.parse(translations));
  } catch (error) {
    console.error('❌ Erro ao buscar traduções:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /api/translations/{lang}:
 *   put:
 *     tags: [Translations]
 *     summary: Atualizar traduções de um idioma
 *     description: Atualiza as traduções para o idioma especificado
 *     parameters:
 *       - in: path
 *         name: lang
 *         required: true
 *         schema:
 *           type: string
 *         description: Código do idioma
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Translation'
 *     responses:
 *       200:
 *         description: Traduções atualizadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Traduções atualizadas com sucesso
 *       400:
 *         description: Dados inválidos
 *       503:
 *         description: Serviço indisponível
 */
app.put('/api/translations/:lang', async (req, res) => {
  try {
    if (!redisClient || !isRedisConnected) {
      return res.status(503).json({ 
        error: 'Serviço de traduções indisponível',
        message: 'Redis não está conectado'
      });
    }

    const { lang } = req.params;
    const translations = req.body;
    
    if (!translations || typeof translations !== 'object') {
      return res.status(400).json({ error: 'Traduções inválidas' });
    }
    
    await redisClient.set(`i18n:${lang}`, JSON.stringify(translations));
    
    res.json({ message: 'Traduções atualizadas com sucesso' });
  } catch (error) {
    console.error('❌ Erro ao atualizar traduções:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /api/translations:
 *   post:
 *     tags: [Translations]
 *     summary: Adicionar novo idioma
 *     description: Adiciona um novo idioma com suas traduções
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [lang, translations]
 *             properties:
 *               lang:
 *                 type: string
 *                 description: Código do idioma
 *                 example: es
 *               translations:
 *                 $ref: '#/components/schemas/Translation'
 *     responses:
 *       201:
 *         description: Idioma adicionado com sucesso
 *       400:
 *         description: Dados inválidos
 *       503:
 *         description: Serviço indisponível
 */
app.post('/api/translations', async (req, res) => {
  try {
    if (!redisClient || !isRedisConnected) {
      return res.status(503).json({ 
        error: 'Serviço de traduções indisponível',
        message: 'Redis não está conectado'
      });
    }

    const { lang, translations } = req.body;
    
    if (!lang || !translations || typeof translations !== 'object') {
      return res.status(400).json({ error: 'Idioma e traduções são obrigatórios' });
    }
    
    await redisClient.set(`i18n:${lang}`, JSON.stringify(translations));
    
    res.status(201).json({ message: 'Idioma adicionado com sucesso' });
  } catch (error) {
    console.error('❌ Erro ao adicionar idioma:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /api/translations/{lang}:
 *   delete:
 *     tags: [Translations]
 *     summary: Remover idioma
 *     description: Remove um idioma e suas traduções
 *     parameters:
 *       - in: path
 *         name: lang
 *         required: true
 *         schema:
 *           type: string
 *         description: Código do idioma
 *     responses:
 *       200:
 *         description: Idioma removido com sucesso
 *       503:
 *         description: Serviço indisponível
 */
app.delete('/api/translations/:lang', async (req, res) => {
  try {
    if (!redisClient || !isRedisConnected) {
      return res.status(503).json({ 
        error: 'Serviço de traduções indisponível',
        message: 'Redis não está conectado'
      });
    }

    const { lang } = req.params;
    
    await redisClient.del(`i18n:${lang}`);
    
    res.json({ message: 'Idioma removido com sucesso' });
  } catch (error) {
    console.error('❌ Erro ao remover idioma:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /api/languages:
 *   get:
 *     tags: [Translations]
 *     summary: Listar idiomas disponíveis
 *     description: Retorna lista de todos os idiomas configurados
 *     responses:
 *       200:
 *         description: Lista de idiomas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["en", "pt"]
 *       503:
 *         description: Serviço indisponível
 */
app.get('/api/languages', async (req, res) => {
  try {
    if (!redisClient || !isRedisConnected) {
      return res.status(503).json({ 
        error: 'Serviço de traduções indisponível',
        message: 'Redis não está conectado'
      });
    }

    const keys = await redisClient.keys('i18n:*');
    const languages = keys.map(key => key.replace('i18n:', ''));
    
    res.json(languages);
  } catch (error) {
    console.error('❌ Erro ao listar idiomas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /api/exchange-rate:
 *   get:
 *     tags: [Exchange Rate]
 *     summary: Cotação USD/BRL em tempo real
 *     description: Retorna a cotação atual do dólar americano em relação ao real brasileiro
 *     responses:
 *       200:
 *         description: Cotação obtida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExchangeRate'
 *       500:
 *         description: Erro interno do servidor
 */
app.get('/api/exchange-rate', async (req, res) => {
  try {
    const response = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL');
    
    if (!response.ok) {
      throw new Error('Erro ao buscar cotação');
    }
    
    const data = await response.json();
    const usdBrl = data.USDBRL;
    
    // Formatar dados da cotação
    const exchangeData = {
      rate: parseFloat(usdBrl.bid),
      high: parseFloat(usdBrl.high),
      low: parseFloat(usdBrl.low),
      variation: parseFloat(usdBrl.pctChange),
      varBid: parseFloat(usdBrl.varBid),
      timestamp: new Date(usdBrl.create_date),
      name: usdBrl.name,
      code: usdBrl.code,
      codein: usdBrl.codein
    };
    
    res.json(exchangeData);
  } catch (error) {
    console.error('❌ Erro ao buscar cotação:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

/**
 * @swagger
 * /api/exchange-rate/cached:
 *   get:
 *     tags: [Exchange Rate]
 *     summary: Cotação USD/BRL com cache Redis
 *     description: Retorna a cotação do dólar com cache Redis para melhor performance
 *     responses:
 *       200:
 *         description: Cotação obtida com sucesso (pode ser do cache)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ExchangeRate'
 *                 - type: object
 *                   properties:
 *                     cached:
 *                       type: boolean
 *                       description: Indica se a resposta veio do cache
 *                     cacheAge:
 *                       type: number
 *                       description: Idade do cache em segundos
 *       503:
 *         description: Serviço indisponível
 */
app.get('/api/exchange-rate/cached', async (req, res) => {
  try {
    if (!redisClient || !isRedisConnected) {
      return res.status(503).json({ 
        error: 'Serviço de traduções indisponível',
        message: 'Redis não está conectado'
      });
    }

    // Verificar se existe no cache
    const cached = await redisClient.get('exchange_rate:usd_brl');
    
    if (cached) {
      const data = JSON.parse(cached);
      const cacheAge = Date.now() - data.cachedAt;
      
      // Cache válido por 1 minuto
      if (cacheAge < 60000) {
        return res.json({
          ...data.exchangeData,
          cached: true,
          cacheAge: Math.round(cacheAge / 1000)
        });
      }
    }
    
    // Buscar nova cotação
    const response = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL');
    
    if (!response.ok) {
      throw new Error('Erro ao buscar cotação');
    }
    
    const data = await response.json();
    const usdBrl = data.USDBRL;
    
    const exchangeData = {
      rate: parseFloat(usdBrl.bid),
      high: parseFloat(usdBrl.high),
      low: parseFloat(usdBrl.low),
      variation: parseFloat(usdBrl.pctChange),
      varBid: parseFloat(usdBrl.varBid),
      timestamp: new Date(usdBrl.create_date),
      name: usdBrl.name,
      code: usdBrl.code,
      codein: usdBrl.codein
    };
    
    // Salvar no cache Redis
    await redisClient.set('exchange_rate:usd_brl', JSON.stringify({
      exchangeData,
      cachedAt: Date.now()
    }));
    
    res.json({
      ...exchangeData,
      cached: false,
      cacheAge: 0
    });
    
  } catch (error) {
    console.error('❌ Erro ao buscar cotação:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Inicializar e iniciar servidor
async function start() {
  try {
    await initRedis();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 i18n API rodando na porta ${PORT}`);
      console.log(`📚 Idiomas disponíveis: en, pt`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`📖 Swagger docs: http://localhost:${PORT}/docs`);
      console.log(`🌍 Redis status: ${isRedisConnected ? 'connected' : 'disconnected'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

start()
