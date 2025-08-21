# 📚 Documentação das APIs - InvestPro

## 🔐 Account API (Porta 4000)

### Base URL
```
http://localhost:4000 (desenvolvimento)
https://invest-pro-42u1.vercel.app (produção)
```

### Endpoints

#### 1. Health Check
```http
GET /health
```

**Resposta:**
```json
{
  "status": "OK",
  "ts": "2025-08-21T14:37:06.367Z",
  "database": "connected",
  "environment": "development"
}
```

---

#### 2. Registro de Usuário
```http
POST /auth/register
```

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "11999999999",
  "cpf": "12345678901",
  "rg": "1234567",
  "income": "5000.00",
  "password": "123456",
  "address": {
    "street": "Rua das Flores, 123",
    "cep": "01234-567",
    "city": "São Paulo",
    "state": "SP"
  }
}
```

**Resposta (201):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Campos obrigatórios:** `name`, `cpf`, `rg`, `income`, `password`, `address`
**Campos opcionais:** `email`, `phone` (pelo menos um deve ser fornecido)

---

#### 3. Login de Usuário
```http
POST /auth/login
```

**Body:**
```json
{
  "email": "joao@email.com",
  "password": "123456"
}
```

**OU**
```json
{
  "phone": "11999999999",
  "password": "123456"
}
```

**Resposta (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### 4. Listar Usuários
```http
GET /accounts
Authorization: Bearer {token}
```

**Resposta (200):**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "11999999999",
    "cpf": "12345678901",
    "rg": "1234567",
    "income": 5000.00,
    "created_at": "2025-08-21T14:37:06.367Z"
  }
]
```

---

#### 5. Buscar Usuário por ID
```http
GET /accounts/{id}
Authorization: Bearer {token}
```

**Resposta (200):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "11999999999",
  "cpf": "12345678901",
  "rg": "1234567",
  "income": 5000.00,
  "created_at": "2025-08-21T14:37:06.367Z",
  "address": {
    "street": "Rua das Flores, 123",
    "cep": "01234-567",
    "city": "São Paulo",
    "state": "SP"
  }
}
```

---

#### 6. Atualizar Usuário
```http
PUT /accounts/{id}
Authorization: Bearer {token}
```

**Body (parcial):**
```json
{
  "name": "João Silva Santos",
  "income": "6000.00",
  "address": {
    "street": "Rua das Flores, 456",
    "cep": "01234-789",
    "city": "São Paulo",
    "state": "SP"
  }
}
```

**Resposta (200):**
```json
{
  "ok": true
}
```

---

#### 7. Deletar Usuário
```http
DELETE /accounts/{id}
Authorization: Bearer {token}
```

**Resposta (200):**
```json
{
  "ok": true
}
```

---

## 🌍 i18n API (Porta 3000)

### Base URL
```
http://localhost:3000 (desenvolvimento)
https://invest-pro-42u1.vercel.app (produção)
```

### Endpoints

#### 1. Health Check
```http
GET /health
```

**Resposta:**
```json
{
  "status": "OK",
  "timestamp": "2025-08-21T14:37:06.367Z",
  "redis": "connected",
  "environment": "development"
}
```

---

#### 2. Listar Idiomas Disponíveis
```http
GET /api/languages
```

**Resposta (200):**
```json
["en", "pt"]
```

---

#### 3. Obter Traduções por Idioma
```http
GET /api/translations/{lang}
```

**Parâmetros:**
- `lang`: Código do idioma (`en` para inglês, `pt` para português)

**Resposta (200):**
```json
{
  "title": "InvestPro",
  "subtitle": "Smart Investment Platform",
  "language": "Language",
  "hero": {
    "title": "Invest Smart, Grow Faster",
    "subtitle": "Access the best investment opportunities with real-time market data and expert analysis",
    "cta": "Start Investing",
    "learn_more": "Learn More"
  },
  "exchange": {
    "title": "USD/BRL Exchange Rate",
    "last_update": "Last update",
    "high": "High",
    "low": "Low",
    "variation": "Variation"
  }
}
```

---

#### 4. Atualizar Traduções
```http
PUT /api/translations/{lang}
```

**Body:**
```json
{
  "title": "InvestPro",
  "subtitle": "Plataforma de Investimentos Inteligente",
  "hero": {
    "title": "Invista Inteligente, Cresça Mais Rápido",
    "subtitle": "Acesse as melhores oportunidades de investimento",
    "cta": "Começar a Investir",
    "learn_more": "Saiba Mais"
  }
}
```

**Resposta (200):**
```json
{
  "message": "Traduções atualizadas com sucesso"
}
```

---

#### 5. Adicionar Novo Idioma
```http
POST /api/translations
```

**Body:**
```json
{
  "lang": "es",
  "translations": {
    "title": "InvestPro",
    "subtitle": "Plataforma de Inversión Inteligente",
    "hero": {
      "title": "Invierte Inteligente, Crece Más Rápido",
      "cta": "Comenzar a Invertir"
    }
  }
}
```

**Resposta (201):**
```json
{
  "message": "Idioma adicionado com sucesso"
}
```

---

#### 6. Remover Idioma
```http
DELETE /api/translations/{lang}
```

**Resposta (200):**
```json
{
  "message": "Idioma removido com sucesso"
}
```

---

#### 7. Cotação USD/BRL (Tempo Real)
```http
GET /api/exchange-rate
```

**Resposta (200):**
```json
{
  "rate": 5.4797,
  "high": 5.495,
  "low": 5.45961,
  "variation": 0.192716,
  "timestamp": "2025-08-21T14:37:06.367Z",
  "name": "Dólar Americano/Real Brasileiro",
  "code": "USD",
  "codein": "BRL"
}
```

---

#### 8. Cotação USD/BRL (Com Cache)
```http
GET /api/exchange-rate/cached
```

**Resposta (200):**
```json
{
  "rate": 5.4797,
  "high": 5.495,
  "low": 5.45961,
  "variation": 0.192716,
  "timestamp": "2025-08-21T14:37:06.367Z",
  "name": "Dólar Americano/Real Brasileiro",
  "code": "USD",
  "codein": "BRL",
  "cached": false,
  "cacheAge": 0
}
```

---

## 🔐 Autenticação

### JWT Token
- **Formato:** `Authorization: Bearer {token}`
- **Validade:** 24 horas (configurável via `JWT_EXPIRES_IN`)
- **Algoritmo:** HS256

### Exemplo de Uso
```bash
# 1. Fazer login para obter token
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","password":"123456"}'

# 2. Usar token para acessar rotas protegidas
curl -H "Authorization: Bearer {token}" \
  http://localhost:4000/accounts
```

---

## 🗄️ Banco de Dados

### PostgreSQL (Account API)
```sql
-- Tabela de usuários
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  cpf TEXT UNIQUE,
  rg TEXT,
  income NUMERIC,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de endereços
CREATE TABLE addresses (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  street TEXT,
  cep TEXT,
  city TEXT,
  state TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Redis (i18n API)
```
i18n:en → Traduções em inglês
i18n:pt → Traduções em português
exchange_rate:usd_brl → Cache de cotações (1 minuto)
```

---

## 🧪 Testes

### Scripts de Teste
```bash
# Teste automático de todas as APIs
cd back
./scripts/test-apis.sh

# Setup completo
./scripts/quick-setup.sh
```

### Testes Manuais
```bash
# Health Check
curl http://localhost:4000/health
curl http://localhost:3000/health

# Teste de registro
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","cpf":"12345678901","rg":"1234567","income":"5000","password":"123456","address":{"street":"Rua Teste","cep":"01234-567","city":"São Paulo","state":"SP"}}'

# Teste de traduções
curl http://localhost:3000/api/translations/en
curl http://localhost:3000/api/exchange-rate
```

---

## 🚀 Deploy

### Vercel
```bash
# Deploy automático
vercel --prod

# Configurar variáveis no dashboard
# Settings → Environment Variables
```

### Variáveis Obrigatórias
```bash
DATABASE_URL=postgres://user:password@host:port/database?sslmode=require
KV_URL=rediss://default:token@host:port
JWT_SECRET=sua_chave_secreta_super_segura
```

---

## 📊 Monitoramento

### Health Checks
- **Account API**: `/health` - Status + Database
- **i18n API**: `/health` - Status + Redis

### Logs
- **Account API**: `logs/account-api.log`
- **i18n API**: `logs/i18n-api.log`

---

## 🔍 Troubleshooting

### Problemas Comuns

| Problema | Solução |
|----------|---------|
| "Database not connected" | Verificar `DATABASE_URL` |
| "Redis not connected" | Verificar `KV_URL` |
| "JWT error" | Verificar `JWT_SECRET` |
| "CORS error" | Verificar `CORS_ORIGIN` |
| Porta em uso | Parar outros serviços ou mudar porta |

### Comandos Úteis
```bash
# Ver logs
docker logs investpro-account-api
docker logs investpro-i18n-api

# Reiniciar APIs
docker-compose restart account-api i18n-api

# Ver status
docker ps
docker-compose ps
```

---

## 📚 Recursos Adicionais

- [Fastify Documentation](https://www.fastify.io/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)

---

**🎉 APIs documentadas e prontas para uso!**

Para dúvidas ou problemas, consulte esta documentação ou execute os scripts de teste.
