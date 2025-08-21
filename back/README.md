# 🚀 InvestPro Backend APIs

## 📋 Visão Geral

Este projeto contém duas APIs principais para a plataforma InvestPro:

1. **Account API** - Autenticação e gerenciamento de usuários
2. **i18n API** - Traduções e cotações de câmbio

## 🏗️ Arquitetura

```
back/
├── account-api/          # API de autenticação e usuários
│   ├── server.js         # Servidor Fastify com Swagger
│   ├── package.json      # Dependências
│   └── Dockerfile        # Container Docker
├── i18n-api/             # API de traduções e cotações
│   ├── server.js         # Servidor Express com Swagger
│   ├── package.json      # Dependências
│   └── Dockerfile        # Container Docker
├── scripts/              # Scripts de automação
├── docker/               # Configurações Docker
├── vercel.json           # Configuração Vercel
└── README.md             # Esta documentação
```

## 🚀 Quick Start

### 1. Setup Automático (Recomendado)
```bash
cd back
./scripts/quick-setup.sh
```

### 2. Setup Manual
```bash
# Terminal 1 - Account API
cd back/account-api
npm run dev

# Terminal 2 - i18n API
cd back/i18n-api
npm run dev
```

### 3. Docker
```bash
# Rodar todas as APIs
docker-compose up -d

# Rodar apenas as APIs (sem frontend)
docker-compose up postgres redis account-api i18n-api -d
```

## 📚 Documentação das APIs

### 🔐 Account API (Porta 4000)

**Swagger UI**: http://localhost:4000/docs

#### Endpoints Principais:

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| `GET` | `/health` | Status da API | ❌ |
| `POST` | `/auth/register` | Registro de usuário | ❌ |
| `POST` | `/auth/login` | Login e geração de token | ❌ |
| `GET` | `/accounts` | Listar usuários | ✅ |
| `GET` | `/accounts/:id` | Buscar usuário | ✅ |
| `PUT` | `/accounts/:id` | Atualizar usuário | ✅ |
| `DELETE` | `/accounts/:id` | Deletar usuário | ✅ |

#### Autenticação:
- **JWT Token** no header: `Authorization: Bearer {token}`
- **Registro obrigatório**: nome, CPF, RG, renda, senha, endereço
- **Login**: email OU telefone + senha

### 🌍 i18n API (Porta 3000)

**Swagger UI**: http://localhost:3000/docs

#### Endpoints Principais:

| Método | Rota | Descrição | Cache |
|--------|------|-----------|-------|
| `GET` | `/health` | Status da API | ❌ |
| `GET` | `/api/languages` | Listar idiomas | ❌ |
| `GET` | `/api/translations/:lang` | Traduções por idioma | ✅ |
| `PUT` | `/api/translations/:lang` | Atualizar traduções | ✅ |
| `POST` | `/api/translations` | Adicionar idioma | ✅ |
| `DELETE` | `/api/translations/:lang` | Remover idioma | ✅ |
| `GET` | `/api/exchange-rate` | Cotação USD/BRL | ❌ |
| `GET` | `/api/exchange-rate/cached` | Cotação com cache | ✅ |

#### Idiomas Suportados:
- **en** - Inglês
- **pt** - Português

#### Cache Redis:
- **Traduções**: Persistente
- **Cotações**: 1 minuto

## 🗄️ Banco de Dados

### PostgreSQL (Account API)
- **Tabela**: `users` - Dados dos usuários
- **Tabela**: `addresses` - Endereços dos usuários
- **Relacionamento**: 1:1 (usuário ↔ endereço)

### Redis (i18n API)
- **Chaves**: `i18n:{lang}` - Traduções por idioma
- **Chaves**: `exchange_rate:usd_brl` - Cache de cotações

## 🔧 Configuração

### Variáveis de Ambiente

```bash
# Obrigatórias
DATABASE_URL=postgres://user:password@host:port/database?sslmode=require
KV_URL=rediss://default:token@host:port
JWT_SECRET=sua_chave_secreta_super_segura

# Opcionais
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
BCRYPT_SALT_ROUNDS=10
```

### Serviços Recomendados

- **PostgreSQL**: [Neon](https://neon.tech) ou [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- **Redis**: [Upstash](https://upstash.com) ou [Vercel KV](https://vercel.com/docs/storage/vercel-kv)

## 🧪 Testes

### Script de Teste Automático
```bash
cd back
./scripts/test-apis.sh
```

### Testes Manuais
```bash
# Health Check
curl http://localhost:4000/health
curl http://localhost:3000/health

# Teste de Registro
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","cpf":"12345678901","rg":"1234567","income":"5000","password":"123456","address":{"street":"Rua Teste","cep":"01234-567","city":"São Paulo","state":"SP"}}'

# Teste de Traduções
curl http://localhost:3000/api/translations/en
curl http://localhost:3000/api/exchange-rate
```

## 🚀 Deploy

### Vercel (Recomendado)
```bash
# Deploy automático
vercel --prod

# Configurar variáveis no dashboard
# Settings → Environment Variables
```

### Outras Plataformas
- **Render**: Configure variáveis no dashboard
- **Railway**: Use `railway.toml`
- **Heroku**: Use `heroku config:set`

## 📊 Monitoramento

### Health Checks
- **Account API**: `/health` - Status + Database
- **i18n API**: `/health` - Status + Redis

### Logs
- **Account API**: `logs/account-api.log`
- **i18n API**: `logs/i18n-api.log`

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

## 📚 Recursos Adicionais

- [Fastify Documentation](https://www.fastify.io/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [Swagger/OpenAPI](https://swagger.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)

## 🆘 Suporte

### Scripts Disponíveis
- `./scripts/quick-setup.sh` - Setup completo
- `./scripts/test-apis.sh` - Testes automáticos
- `./scripts/setup-env.sh` - Configuração de variáveis

### Logs e Debug
- Verificar logs das APIs
- Executar testes automáticos
- Verificar variáveis de ambiente
- Testar conexões individualmente

---

**🎉 APIs prontas para produção!**

Para dúvidas ou problemas, consulte a documentação Swagger ou execute os scripts de teste.
