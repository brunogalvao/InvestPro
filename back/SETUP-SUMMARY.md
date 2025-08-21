# 🚀 RESUMO DO SETUP - INVESTPRO BACKEND

## ✅ O que foi configurado

### 🔧 APIs Corrigidas
- **Account API** (porta 4000): Autenticação e CRUD de usuários
- **i18n API** (porta 3000): Traduções e cotações de câmbio

### 📁 Arquivos Criados
- `env.config` → Renomeie para `.env` e configure suas credenciais
- `scripts/setup-env.sh` → Script para configurar variáveis de ambiente
- `scripts/quick-setup.sh` → Script para setup completo automático
- `scripts/test-apis.sh` → Script para testar as APIs
- `README-ENV.md` → Documentação completa das variáveis de ambiente
- `vercel.json` → Configuração corrigida para deploy no Vercel

## 🚀 Setup Rápido

### 1. Configurar Variáveis de Ambiente
```bash
cd back
cp env.config .env
# Edite o arquivo .env com suas credenciais
```

### 2. Setup Automático (Recomendado)
```bash
cd back
./scripts/quick-setup.sh
```

### 3. Setup Manual
```bash
# Terminal 1 - Account API
cd back/account-api
npm run dev

# Terminal 2 - i18n API
cd back/i18n-api
npm run dev
```

## 🔧 Variáveis Obrigatórias

### Para Account API funcionar:
```bash
DATABASE_URL=postgres://user:password@host:port/database?sslmode=require
JWT_SECRET=sua_chave_secreta_super_segura
```

### Para i18n API funcionar:
```bash
KV_URL=rediss://default:token@host:port
# ou
REDIS_URL=rediss://default:token@host:port
```

## 🗄️ Serviços Gratuitos Recomendados

### Database (PostgreSQL)
- **Neon**: https://neon.tech
- **Vercel Postgres**: https://vercel.com/docs/storage/vercel-postgres

### Redis/Cache
- **Upstash**: https://upstash.com
- **Vercel KV**: https://vercel.com/docs/storage/vercel-kv

## 🧪 Testando

### Health Checks
```bash
# Account API
curl http://localhost:4000/health

# i18n API
curl http://localhost:3000/health
```

### Teste Completo
```bash
cd back
./scripts/test-apis.sh
```

## 🚀 Deploy para Produção

### Vercel (Recomendado)
1. **Configure as variáveis no dashboard:**
   - Vá para seu projeto no Vercel
   - Settings → Environment Variables
   - Adicione todas as variáveis necessárias

2. **Deploy automático:**
   ```bash
   vercel --prod
   ```

### Variáveis de Produção Obrigatórias
```bash
DATABASE_URL=postgres://...
KV_URL=rediss://...
JWT_SECRET=sua_chave_super_segura
NODE_ENV=production
CORS_ORIGIN=https://seu-dominio.vercel.app
```

## 🔍 Troubleshooting

### Problema: "Database not connected"
- Verifique se `DATABASE_URL` está configurada
- Teste a conexão com o banco
- Verifique se o banco está rodando

### Problema: "Redis not connected"
- Verifique se `KV_URL` ou `REDIS_URL` está configurada
- Teste a conexão com o Redis
- Verifique se o Redis está rodando

### Problema: APIs não iniciam
- Verifique se as portas 3000 e 4000 estão livres
- Verifique os logs em `logs/`
- Execute `./scripts/test-apis.sh` para diagnóstico

## 📋 Checklist de Deploy

- [ ] Configure `DATABASE_URL` com PostgreSQL
- [ ] Configure `KV_URL` ou `REDIS_URL` com Redis
- [ ] Gere `JWT_SECRET` segura
- [ ] Configure `CORS_ORIGIN` para produção
- [ ] Teste localmente com `./scripts/test-apis.sh`
- [ ] Configure variáveis no Vercel
- [ ] Deploy com `vercel --prod`
- [ ] Teste endpoints de produção

## 🆘 Suporte

### Scripts Disponíveis
- `./scripts/setup-env.sh` → Configurar variáveis
- `./scripts/quick-setup.sh` → Setup completo
- `./scripts/test-apis.sh` → Testar APIs

### Logs
- Account API: `logs/account-api.log`
- i18n API: `logs/i18n-api.log`

### Documentação
- `README-ENV.md` → Variáveis de ambiente
- `env.example` → Exemplo de configuração

## 🎯 Próximos Passos

1. **Configure suas credenciais** no arquivo `.env`
2. **Teste localmente** com `./scripts/quick-setup.sh`
3. **Configure serviços na nuvem** (Neon, Upstash, etc.)
4. **Deploy para produção** no Vercel
5. **Monitore e teste** em produção

---

**🎉 Seu backend está pronto para deploy!**

Para dúvidas, consulte a documentação ou execute os scripts de teste.
