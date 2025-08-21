const express = require('express');
const Redis = require('redis');
const cors = require('cors');
const helmet = require('helmet');

// Importar fetch para Node.js (versões < 18)
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Conectar ao Redis (Vercel KV ou Redis externo)
let redisClient;
if (process.env.KV_URL) {
  // Vercel KV
  redisClient = Redis.createClient({
    url: process.env.KV_URL
  });
  console.log('✅ Connected to Vercel KV');
} else if (process.env.REDIS_URL) {
  // Redis externo
  redisClient = Redis.createClient({
    url: process.env.REDIS_URL
  });
  console.log('✅ Connected to external Redis');
} else {
  // Modo demo sem Redis
  redisClient = null;
  console.log('⚠️  No Redis connection, running in demo mode');
}

if (redisClient) {
  redisClient.on('error', (err) => console.log('Redis Client Error', err));
  redisClient.on('connect', () => console.log('Connected to Redis'));
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
    if (!redisClient) {
      console.log('⚠️  Redis não configurado, pulando inicialização de traduções padrão.');
      return;
    }

    await redisClient.connect();
    
    // Verificar se já existem traduções
    const hasTranslations = await redisClient.exists('i18n:en');
    
    if (!hasTranslations) {
      console.log('Inicializando traduções padrão...');
      
      // Salvar traduções no Redis
      for (const [lang, translations] of Object.entries(defaultTranslations)) {
        await redisClient.set(`i18n:${lang}`, JSON.stringify(translations));
      }
      
      console.log('Traduções inicializadas com sucesso!');
    }
  } catch (error) {
    console.error('Erro ao inicializar traduções:', error);
  }
}

// Rotas da API

// GET - Obter traduções de um idioma
app.get('/api/translations/:lang', async (req, res) => {
  try {
    if (!redisClient) {
      return res.status(503).json({ error: 'Serviço de traduções indisponível' });
    }

    const { lang } = req.params;
    const translations = await redisClient.get(`i18n:${lang}`);
    
    if (!translations) {
      return res.status(404).json({ error: 'Idioma não encontrado' });
    }
    
    res.json(JSON.parse(translations));
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT - Atualizar traduções de um idioma
app.put('/api/translations/:lang', async (req, res) => {
  try {
    if (!redisClient) {
      return res.status(503).json({ error: 'Serviço de traduções indisponível' });
    }

    const { lang } = req.params;
    const translations = req.body;
    
    await redisClient.set(`i18n:${lang}`, JSON.stringify(translations));
    
    res.json({ message: 'Traduções atualizadas com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST - Adicionar novo idioma
app.post('/api/translations', async (req, res) => {
  try {
    if (!redisClient) {
      return res.status(503).json({ error: 'Serviço de traduções indisponível' });
    }

    const { lang, translations } = req.body;
    
    if (!lang || !translations) {
      return res.status(400).json({ error: 'Idioma e traduções são obrigatórios' });
    }
    
    await redisClient.set(`i18n:${lang}`, JSON.stringify(translations));
    
    res.status(201).json({ message: 'Idioma adicionado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE - Remover idioma
app.delete('/api/translations/:lang', async (req, res) => {
  try {
    if (!redisClient) {
      return res.status(503).json({ error: 'Serviço de traduções indisponível' });
    }

    const { lang } = req.params;
    
    await redisClient.del(`i18n:${lang}`);
    
    res.json({ message: 'Idioma removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET - Listar idiomas disponíveis
app.get('/api/languages', async (req, res) => {
  try {
    if (!redisClient) {
      return res.status(503).json({ error: 'Serviço de traduções indisponível' });
    }

    const keys = await redisClient.keys('i18n:*');
    const languages = keys.map(key => key.replace('i18n:', ''));
    
    res.json(languages);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Rota para cotação do dólar
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
    console.error('Erro ao buscar cotação:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Rota para buscar cotação com cache Redis
app.get('/api/exchange-rate/cached', async (req, res) => {
  try {
    if (!redisClient) {
      return res.status(503).json({ error: 'Serviço de traduções indisponível' });
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
    console.error('Erro ao buscar cotação:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Inicializar e iniciar servidor
initializeTranslations().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 i18n API rodando na porta ${PORT}`);
    console.log(`📚 Idiomas disponíveis: en, pt`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  });
});
