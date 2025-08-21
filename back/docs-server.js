const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 4001;

// Configuração do Swagger para Account API
const accountApiSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'InvestPro Account API',
      description: 'API para autenticação e gerenciamento de contas de usuários',
      version: '1.0.0',
      contact: {
        name: 'InvestPro Team',
        email: 'dev@investpro.com'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' ? 'https://invest-pro-42u1.vercel.app' : 'http://localhost:4000',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    tags: [
      { name: 'Auth', description: 'Endpoints de autenticação' },
      { name: 'Accounts', description: 'Endpoints de gerenciamento de contas' },
      { name: 'Health', description: 'Endpoints de status da API' }
    ],
    components: {
      securitySchemes: {
        Bearer: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token no formato: Bearer {token}'
        }
      }
    }
  },
  apis: ['./account-api-docs.js']
});

// Configuração do Swagger para i18n API
const i18nApiSpec = swaggerJsdoc({
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
    ]
  },
  apis: ['./i18n-api-docs.js']
});

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Rota principal
app.get('/', (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const accountApiUrl = isProduction ? 'https://invest-pro-42u1.vercel.app' : 'http://localhost:4000';
  const i18nApiUrl = isProduction ? 'https://invest-pro-42u1.vercel.app' : 'http://localhost:3000';
  
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>InvestPro API Documentation</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                margin: 0; 
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                color: #333;
            }
            .container { 
                max-width: 1200px; 
                margin: 0 auto; 
                background: white;
                border-radius: 20px;
                padding: 40px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            }
            h1 { 
                text-align: center; 
                color: #2c3e50; 
                margin-bottom: 40px;
                font-size: 2.5em;
            }
            .api-section { 
                margin: 30px 0; 
                padding: 30px; 
                border: 1px solid #e1e8ed; 
                border-radius: 15px;
                background: #f8f9fa;
                transition: transform 0.2s, box-shadow 0.2s;
            }
            .api-section:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            }
            .api-title { 
                color: #2c3e50; 
                font-size: 28px; 
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .api-description { 
                color: #7f8c8d; 
                margin-bottom: 25px;
                font-size: 16px;
                line-height: 1.6;
            }
            .api-link { 
                display: inline-block; 
                padding: 12px 24px; 
                background: linear-gradient(45deg, #667eea, #764ba2); 
                color: white; 
                text-decoration: none; 
                border-radius: 25px; 
                margin: 8px; 
                font-weight: 500;
                transition: all 0.3s;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
            }
            .api-link:hover { 
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
                background: linear-gradient(45deg, #5a6fd8, #6a4190);
            }
            .status { 
                display: inline-block; 
                padding: 8px 16px; 
                border-radius: 20px; 
                font-size: 14px; 
                font-weight: bold;
                margin-left: 10px;
            }
            .status.online { 
                background: #27ae60; 
                color: white; 
            }
            .status.offline { 
                background: #e74c3c; 
                color: white; 
            }
            .status.checking {
                background: #f39c12;
                color: white;
            }
            .footer {
                text-align: center;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e1e8ed;
                color: #7f8c8d;
            }
            .badge {
                display: inline-block;
                padding: 4px 8px;
                background: #3498db;
                color: white;
                border-radius: 12px;
                font-size: 12px;
                margin-left: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 InvestPro API Documentation</h1>
            
            <div class="api-section">
                <div class="api-title">
                    🔐 Account API
                    <span class="badge">${isProduction ? 'PROD' : 'DEV'}</span>
                </div>
                <div class="api-description">API para autenticação e gerenciamento de contas de usuários</div>
                <div>Status: <span class="status checking" id="account-status">Verificando...</span></div>
                <div>
                    <a href="/docs/account" class="api-link">📖 Swagger UI</a>
                    <a href="${accountApiUrl}/health" class="api-link" target="_blank">🔍 Health Check</a>
                </div>
            </div>
            
            <div class="api-section">
                <div class="api-title">
                    🌍 i18n API
                    <span class="badge">${isProduction ? 'PROD' : 'DEV'}</span>
                </div>
                <div class="api-description">API para gerenciamento de traduções e cotações de câmbio</div>
                <div>Status: <span class="status checking" id="i18n-status">Verificando...</span></div>
                <div>
                    <a href="/docs/i18n" class="api-link">📖 Swagger UI</a>
                    <a href="${i18nApiUrl}/health" class="api-link" target="_blank">🔍 Health Check</a>
                </div>
            </div>
            
            <div class="api-section">
                <div class="api-title">📚 Documentação Estática</div>
                <div class="api-description">Documentação completa em markdown com interface interativa</div>
                <div>
                    <a href="/docs/static" class="api-link">📖 Ver Documentação</a>
                    <a href="/download/api-docs" class="api-link">⬇️ Download Markdown</a>
                </div>
            </div>
            
            <div class="footer">
                <p>🌐 <strong>InvestPro Backend APIs</strong> - Documentação interativa e Swagger UI</p>
                <p>🚀 Deploy automático via Vercel | 📱 Responsivo | 🔍 Status em tempo real</p>
            </div>
        </div>
        
        <script>
            // Verificar status das APIs
            async function checkApiStatus() {
                const accountUrl = '${accountApiUrl}/health';
                const i18nUrl = '${i18nApiUrl}/health';
                
                try {
                    const accountResponse = await fetch(accountUrl);
                    if (accountResponse.ok) {
                        document.getElementById('account-status').textContent = 'Online';
                        document.getElementById('account-status').className = 'status online';
                    } else {
                        throw new Error('API offline');
                    }
                } catch (error) {
                    document.getElementById('account-status').textContent = 'Offline';
                    document.getElementById('account-status').className = 'status offline';
                }
                
                try {
                    const i18nResponse = await fetch(i18nUrl);
                    if (i18nResponse.ok) {
                        document.getElementById('i18n-status').textContent = 'Online';
                        document.getElementById('i18n-status').className = 'status online';
                    } else {
                        throw new Error('API offline');
                    }
                } catch (error) {
                    document.getElementById('i18n-status').textContent = 'Offline';
                    document.getElementById('i18n-status').className = 'status offline';
                }
            }
            
            // Verificar status inicial
            checkApiStatus();
            
            // Verificar a cada 30 segundos
            setInterval(checkApiStatus, 30000);
        </script>
    </body>
    </html>
  `);
});

// Swagger UI para Account API
app.use('/docs/account', swaggerUi.serve, swaggerUi.setup(accountApiSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'InvestPro Account API - Swagger'
}));

// Swagger UI para i18n API
app.use('/docs/i18n', swaggerUi.serve, swaggerUi.setup(i18nApiSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'InvestPro i18n API - Swagger'
}));

// Documentação estática
app.get('/docs/static', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>InvestPro API Documentation</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                margin: 0; 
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                color: #333;
            }
            .container { 
                max-width: 1200px; 
                margin: 0 auto; 
                background: white;
                border-radius: 20px;
                padding: 40px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            }
            .header { 
                background: linear-gradient(45deg, #667eea, #764ba2); 
                padding: 30px; 
                border-radius: 15px; 
                margin-bottom: 30px;
                color: white;
                text-align: center;
            }
            .section { 
                margin: 30px 0; 
                padding: 25px; 
                border: 1px solid #e1e8ed; 
                border-radius: 15px;
                background: #f8f9fa;
            }
            .endpoint { 
                background: white; 
                padding: 20px; 
                margin: 15px 0; 
                border-radius: 10px;
                border-left: 4px solid #667eea;
                box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            }
            .method { 
                display: inline-block; 
                padding: 6px 12px; 
                border-radius: 6px; 
                font-weight: bold; 
                margin-right: 15px;
                font-size: 14px;
            }
            .get { background: #27ae60; color: white; }
            .post { background: #3498db; color: white; }
            .put { background: #f39c12; color: black; }
            .delete { background: #e74c3c; color: white; }
            .url { 
                font-family: 'Monaco', 'Menlo', monospace; 
                background: #ecf0f1; 
                padding: 8px 12px; 
                border-radius: 6px;
                font-size: 14px;
            }
            .back-link { 
                display: inline-block; 
                padding: 12px 24px; 
                background: linear-gradient(45deg, #667eea, #764ba2); 
                color: white; 
                text-decoration: none; 
                border-radius: 25px; 
                margin-bottom: 20px;
                transition: all 0.3s;
            }
            .back-link:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
            }
        </style>
    </head>
    <body>
        <div class="container">
            <a href="/" class="back-link">← Voltar ao Menu Principal</a>
            
            <div class="header">
                <h1>📚 InvestPro API Documentation</h1>
                <p>Documentação completa das APIs para desenvolvimento e integração</p>
            </div>
            
            <div class="section">
                <h2>🔐 Account API (Porta 4000)</h2>
                
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="url">/health</span>
                    <p><strong>Health Check</strong> - Verifica o status da API e conexão com banco</p>
                </div>
                
                <div class="endpoint">
                    <span class="method post">POST</span>
                    <span class="url">/auth/register</span>
                    <p><strong>Registro de Usuário</strong> - Cria uma nova conta de usuário com endereço</p>
                </div>
                
                <div class="endpoint">
                    <span class="method post">POST</span>
                    <span class="url">/auth/login</span>
                    <p><strong>Login de Usuário</strong> - Autentica usuário e retorna JWT token</p>
                </div>
                
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="url">/accounts</span>
                    <p><strong>Listar Usuários</strong> - Retorna lista de todos os usuários (requer autenticação)</p>
                </div>
                
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="url">/accounts/:id</span>
                    <p><strong>Buscar Usuário</strong> - Retorna dados de um usuário específico (requer autenticação)</p>
                </div>
                
                <div class="endpoint">
                    <span class="method put">PUT</span>
                    <span class="url">/accounts/:id</span>
                    <p><strong>Atualizar Usuário</strong> - Atualiza dados de um usuário existente (requer autenticação)</p>
                </div>
                
                <div class="endpoint">
                    <span class="method delete">DELETE</span>
                    <span class="url">/accounts/:id</span>
                    <p><strong>Deletar Usuário</strong> - Remove um usuário e seu endereço (requer autenticação)</p>
                </div>
            </div>
            
            <div class="section">
                <h2>🌍 i18n API (Porta 3000)</h2>
                
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="url">/health</span>
                    <p><strong>Health Check</strong> - Verifica o status da API e conexão com Redis</p>
                </div>
                
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="url">/api/languages</span>
                    <p><strong>Listar Idiomas</strong> - Retorna lista de todos os idiomas configurados</p>
                </div>
                
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="url">/api/translations/:lang</span>
                    <p><strong>Obter Traduções</strong> - Retorna as traduções para o idioma especificado</p>
                </div>
                
                <div class="endpoint">
                    <span class="method put">PUT</span>
                    <span class="url">/api/translations/:lang</span>
                    <p><strong>Atualizar Traduções</strong> - Atualiza as traduções para o idioma especificado</p>
                </div>
                
                <div class="endpoint">
                    <span class="method post">POST</span>
                    <span class="url">/api/translations</span>
                    <p><strong>Adicionar Idioma</strong> - Adiciona um novo idioma com suas traduções</p>
                </div>
                
                <div class="endpoint">
                    <span class="method delete">DELETE</span>
                    <span class="url">/api/translations/:lang</span>
                    <p><strong>Remover Idioma</strong> - Remove um idioma e suas traduções</p>
                </div>
                
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="url">/api/exchange-rate</span>
                    <p><strong>Cotação USD/BRL</strong> - Retorna a cotação atual do dólar em tempo real</p>
                </div>
                
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="url">/api/exchange-rate/cached</span>
                    <p><strong>Cotação com Cache</strong> - Retorna a cotação do dólar com cache Redis</p>
                </div>
            </div>
            
            <div class="section">
                <h2>🔐 Autenticação</h2>
                <p><strong>JWT Token:</strong> Use o header <code>Authorization: Bearer {token}</code> para rotas protegidas</p>
                <p><strong>Validade:</strong> 24 horas (configurável via <code>JWT_EXPIRES_IN</code>)</p>
            </div>
            
            <div class="section">
                <h2>🧪 Testes</h2>
                <p>Use os scripts fornecidos para testar as APIs:</p>
                <ul>
                    <li><code>./scripts/test-apis.sh</code> - Teste automático de todas as APIs</li>
                    <li><code>./scripts/quick-setup.sh</code> - Setup completo</li>
                </ul>
            </div>
        </div>
    </body>
    </html>
  `);
});

// Download da documentação
app.get('/download/api-docs', (req, res) => {
  res.setHeader('Content-Type', 'text/markdown');
  res.setHeader('Content-Disposition', 'attachment; filename="investpro-api-docs.md"');
  res.send(`
# 📚 Documentação das APIs - InvestPro

## 🔐 Account API (Porta 4000)

### Endpoints

#### 1. Health Check
\`\`\`http
GET /health
\`\`\`

#### 2. Registro de Usuário
\`\`\`http
POST /auth/register
\`\`\`

#### 3. Login de Usuário
\`\`\`http
POST /auth/login
\`\`\`

#### 4. Listar Usuários
\`\`\`http
GET /accounts
Authorization: Bearer {token}
\`\`\`

#### 5. Buscar Usuário por ID
\`\`\`http
GET /accounts/{id}
Authorization: Bearer {token}
\`\`\`

#### 6. Atualizar Usuário
\`\`\`http
PUT /accounts/{id}
Authorization: Bearer {token}
\`\`\`

#### 7. Deletar Usuário
\`\`\`http
DELETE /accounts/{id}
Authorization: Bearer {token}
\`\`\`

## 🌍 i18n API (Porta 3000)

### Endpoints

#### 1. Health Check
\`\`\`http
GET /health
\`\`\`

#### 2. Listar Idiomas
\`\`\`http
GET /api/languages
\`\`\`

#### 3. Obter Traduções
\`\`\`http
GET /api/translations/{lang}
\`\`\`

#### 4. Atualizar Traduções
\`\`\`http
PUT /api/translations/{lang}
\`\`\`

#### 5. Adicionar Idioma
\`\`\`http
POST /api/translations
\`\`\`

#### 6. Remover Idioma
\`\`\`http
DELETE /api/translations/{lang}
\`\`\`

#### 7. Cotação USD/BRL
\`\`\`http
GET /api/exchange-rate
\`\`\`

#### 8. Cotação com Cache
\`\`\`http
GET /api/exchange-rate/cached
\`\`\`

---

**🎉 APIs documentadas e prontas para uso!**
  `);
});

// Iniciar servidor
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor de Documentação rodando na porta ${PORT}`);
    console.log(`📖 Acesse: http://localhost:${PORT}`);
    console.log(`🔐 Account API Swagger: http://localhost:${PORT}/docs/account`);
    console.log(`🌍 i18n API Swagger: http://localhost:${PORT}/docs/i18n`);
    console.log(`📚 Documentação Estática: http://localhost:${PORT}/docs/static`);
  });
}

// Exportar para Vercel
module.exports = app;
