# 🚀 Deploy no Render - InvestPro APIs

## 📋 Pré-requisitos

1. **Conta no Render**: [render.com](https://render.com)
2. **Repositório no GitHub** com este código
3. **Git configurado** localmente

## 🔧 Passo a Passo do Deploy

### **1. Criar Conta no Render**

1. Acesse [render.com](https://render.com)
2. Clique em "Get Started"
3. Faça login com sua conta GitHub
4. Autorize o acesso ao repositório

### **2. Deploy Automático com Blueprint**

1. **No dashboard do Render**, clique em "New +"
2. Selecione **"Blueprint"**
3. Conecte seu repositório GitHub
4. Selecione o repositório `investment-page`
5. O Render detectará automaticamente o `render.yaml`
6. Clique em **"Apply"**

### **3. Configuração Manual (Alternativa)**

Se preferir configurar manualmente:

#### **API de Traduções (i18n)**
1. **New +** → **Web Service**
2. **Connect Repository** → Selecione `investment-page`
3. **Configure:**
   - **Name**: `investpro-i18n-api`
   - **Environment**: `Node`
   - **Build Command**: `cd i18n-api && npm ci --only=production`
   - **Start Command**: `cd i18n-api && npm start`
   - **Plan**: `Free`

#### **API de Contas**
1. **New +** → **Web Service**
2. **Connect Repository** → Selecione `investment-page`
3. **Configure:**
   - **Name**: `investpro-account-api`
   - **Environment**: `Node`
   - **Build Command**: `cd account-api && npm ci --only=production`
   - **Start Command**: `cd account-api && npm start`
   - **Plan**: `Free`

#### **PostgreSQL**
1. **New +** → **PostgreSQL**
2. **Configure:**
   - **Name**: `investpro-postgres`
   - **Plan**: `Free`
   - **Database**: `investpro_prod`
   - **User**: `investpro_prod`

#### **Redis**
1. **New +** → **Redis**
2. **Configure:**
   - **Name**: `investpro-redis`
   - **Plan**: `Free`

### **4. Configuração das Variáveis de Ambiente**

#### **API de Traduções:**
```
NODE_ENV=production
PORT=10000
REDIS_URL=<URL_DO_REDIS_DO_RENDER>
CORS_ORIGIN=https://your-frontend-domain.onrender.com
```

#### **API de Contas:**
```
NODE_ENV=production
PORT=10000
DATABASE_URL=<URL_DO_POSTGRES_DO_RENDER>
BCRYPT_SALT_ROUNDS=12
JWT_SECRET=<GERAR_CHAVE_SECRETA>
JWT_EXPIRES_IN=24h
CORS_ORIGIN=https://your-frontend-domain.onrender.com
```

### **5. URLs dos Serviços**

Após o deploy, você terá URLs como:
- **API de Traduções**: `https://investpro-i18n-api.onrender.com`
- **API de Contas**: `https://investpro-account-api.onrender.com`
- **PostgreSQL**: Interno (não acessível externamente)
- **Redis**: Interno (não acessível externamente)

### **6. Teste das APIs**

```bash
# Teste da API de Traduções
curl https://investpro-i18n-api.onrender.com/health

# Teste da API de Contas
curl https://investpro-account-api.onrender.com/health

# Teste das traduções
curl https://investpro-i18n-api.onrender.com/api/translations/pt
```

## 🔄 Auto-Deploy

- O Render fará **deploy automático** sempre que você fizer push para a branch principal
- Você pode configurar **deploy manual** se preferir
- **Rollback automático** em caso de falha

## 📊 Monitoramento

- **Logs em tempo real** no dashboard
- **Métricas de performance**
- **Alertas de saúde** dos serviços
- **Uptime monitoring**

## 💰 Custos

- **Plano Free**: 750 horas/mês
- **PostgreSQL Free**: 1GB de dados
- **Redis Free**: 256MB de dados
- **Bandwidth**: Incluído no plano free

## 🚨 Troubleshooting

### **Erro de Build**
- Verifique se `npm ci --only=production` funciona localmente
- Verifique se todas as dependências estão em `dependencies` (não `devDependencies`)

### **Erro de Start**
- Verifique os logs no dashboard do Render
- Verifique se a porta está configurada corretamente
- Verifique se as variáveis de ambiente estão corretas

### **Erro de Conexão com Banco**
- Verifique se o `DATABASE_URL` está correto
- Verifique se o PostgreSQL está rodando
- Verifique se as credenciais estão corretas

## 🎯 Próximos Passos

1. **Configurar domínio personalizado** (opcional)
2. **Configurar SSL/HTTPS** (automático no Render)
3. **Configurar monitoramento avançado**
4. **Configurar backups automáticos**
5. **Configurar CI/CD pipeline**

## 📞 Suporte

- **Documentação**: [docs.render.com](https://docs.render.com)
- **Community**: [community.render.com](https://community.render.com)
- **Status**: [status.render.com](https://status.render.com)
