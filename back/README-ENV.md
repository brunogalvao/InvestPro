# 🌍 Configuração das Variáveis de Ambiente

## 📋 Visão Geral

Este projeto usa duas APIs principais que precisam de configuração de variáveis de ambiente:

1. **Account API** (porta 4000) - Autenticação e CRUD de usuários
2. **i18n API** (porta 3000) - Traduções e cotações de câmbio

## 🚀 Configuração Rápida

### Opção 1: Script Automático (Recomendado)

```bash
cd back
./scripts/setup-env.sh
```

O script irá guiá-lo através da configuração de todas as variáveis necessárias.

### Opção 2: Configuração Manual

Copie os arquivos de exemplo e configure manualmente:

```bash
cd back
cp env.local .env
cp account-api/env.local account-api/.env
cp i18n-api/env.local i18n-api/.env
```

## 🔧 Variáveis Necessárias

### 🗄️ Database (Account API)

**DATABASE_URL**: URL de conexão com PostgreSQL

**Opções gratuitas:**
- **Neon**: https://neon.tech (PostgreSQL na nuvem)
- **Vercel Postgres**: https://vercel.com/docs/storage/vercel-postgres

**Formato:**
```
postgres://username:password@host:port/database?sslmode=require
```

### 🔴 Redis (i18n API)

**KV_URL** ou **REDIS_URL**: URL de conexão com Redis

**Opções gratuitas:**
- **Upstash**: https://upstash.com (Redis na nuvem)
- **Vercel KV**: https://vercel.com/docs/storage/vercel-kv

**Formato:**
```
rediss://default:token@host:port
```

### 🔐 Segurança

**JWT_SECRET**: Chave secreta para tokens JWT

**Gerar uma chave segura:**
```bash
openssl rand -base64 32
```

**BCRYPT_SALT_ROUNDS**: Rounds de hash para senhas (padrão: 10)

### 🌐 CORS

**CORS_ORIGIN**: Domínios permitidos para requisições

**Para desenvolvimento:**
```
http://localhost:5173,http://localhost:3000
```

**Para produção:**
```
https://seu-dominio.vercel.app,https://outro-dominio.com
```

## 📁 Estrutura dos Arquivos

```
back/
├── .env                    # Variáveis principais
├── account-api/
│   └── .env              # Variáveis específicas da Account API
├── i18n-api/
│   └── .env              # Variáveis específicas da i18n API
├── env.local              # Exemplo de variáveis principais
├── account-api/env.local  # Exemplo de variáveis da Account API
└── i18n-api/env.local    # Exemplo de variáveis da i18n API
```

## 🧪 Testando a Configuração

### 1. Iniciar as APIs

```bash
# Terminal 1 - Account API
cd back/account-api
npm run dev

# Terminal 2 - i18n API
cd back/i18n-api
npm run dev
```

### 2. Executar Testes

```bash
cd back
./scripts/test-apis.sh
```

### 3. Verificar Health Checks

```bash
# Account API
curl http://localhost:4000/health

# i18n API
curl http://localhost:3000/health
```

## 🚀 Deploy para Produção

### Vercel

1. **Configure as variáveis no dashboard do Vercel:**
   - Vá para seu projeto no Vercel
   - Settings → Environment Variables
   - Adicione todas as variáveis necessárias

2. **Variáveis obrigatórias para produção:**
   ```
   DATABASE_URL=postgres://...
   KV_URL=rediss://...
   JWT_SECRET=sua_chave_super_segura
   NODE_ENV=production
   CORS_ORIGIN=https://seu-dominio.vercel.app
   ```

### Outras Plataformas

- **Render**: Configure as variáveis no dashboard
- **Railway**: Use o arquivo `railway.toml`
- **Heroku**: Use `heroku config:set`

## 🔍 Troubleshooting

### Problema: "Database not connected"

**Solução:**
- Verifique se `DATABASE_URL` está configurada
- Teste a conexão com o banco
- Verifique se o banco está rodando

### Problema: "Redis not connected"

**Solução:**
- Verifique se `KV_URL` ou `REDIS_URL` está configurada
- Teste a conexão com o Redis
- Verifique se o Redis está rodando

### Problema: "CORS error"

**Solução:**
- Verifique se `CORS_ORIGIN` inclui seu domínio
- Para desenvolvimento, use `http://localhost:5173`
- Para produção, use `https://seu-dominio.com`

### Problema: "JWT error"

**Solução:**
- Verifique se `JWT_SECRET` está configurada
- Use uma chave secreta longa e complexa
- Gere uma nova chave se necessário

## 📚 Recursos Adicionais

- [Neon PostgreSQL](https://neon.tech) - Banco PostgreSQL gratuito
- [Upstash Redis](https://upstash.com) - Redis gratuito
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Vercel KV](https://vercel.com/docs/storage/vercel-kv)
- [JWT.io](https://jwt.io) - Debug de tokens JWT

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs das APIs
2. Execute o script de teste: `./scripts/test-apis.sh`
3. Verifique se todas as variáveis estão configuradas
4. Teste as conexões individualmente
