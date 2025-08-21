# 🚀 Deploy na Vercel - InvestPro (Frontend + APIs)

## 📋 Pré-requisitos

1. **Conta na Vercel**: [vercel.com](https://vercel.com)
2. **Repositório no GitHub** com este código
3. **Node.js** instalado localmente (opcional, para CLI)

## 🔧 Passo a Passo do Deploy

### **1. Criar Conta na Vercel**

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"Continue with GitHub"**
3. Autorize o acesso ao repositório
4. Complete o cadastro

### **2. Deploy Automático**

1. **No dashboard da Vercel**, clique em **"New Project"**
2. **Import Git Repository** → Selecione `brunogalvao/InvestPro`
3. **Framework Preset**: Deixe como `Other` (ou `Vite` se disponível)
4. **Root Directory**: Deixe como `/` (padrão)
5. **Build Command**: Deixe vazio (usamos vercel.json)
6. **Output Directory**: Deixe vazio (usamos vercel.json)
7. **Install Command**: Deixe vazio
8. **Clique em "Deploy"**

### **3. O que será deployado:**

✅ **Frontend React** - Aplicação principal
✅ **API de Traduções** - `/api/i18n/*`
✅ **API de Contas** - `/api/accounts/*`
✅ **Tudo em um projeto** - URLs organizadas

### **4. Configuração das Variáveis de Ambiente**

Após o deploy inicial, configure as variáveis:

#### **Para o Frontend:**
```
VITE_I18N_API_URL=https://your-project.vercel.app/api/i18n
VITE_ACCOUNT_API_URL=https://your-project.vercel.app/api/accounts
```

#### **Para a API de Traduções:**
```
NODE_ENV=production
REDIS_URL=<URL_DO_SEU_REDIS>
CORS_ORIGIN=*
```

#### **Para a API de Contas:**
```
NODE_ENV=production
DATABASE_URL=<URL_DO_SEU_POSTGRES>
BCRYPT_SALT_ROUNDS=12
JWT_SECRET=<SUA_CHAVE_SECRETA>
JWT_EXPIRES_IN=24h
CORS_ORIGIN=*
```

### **5. URLs dos Serviços**

Após o deploy, você terá URLs como:
- **Frontend**: `https://your-project.vercel.app`
- **API de Traduções**: `https://your-project.vercel.app/api/i18n/*`
- **API de Contas**: `https://your-project.vercel.app/api/accounts/*`
- **Health Check**: `https://your-project.vercel.app/health`

### **6. Teste Completo**

```bash
# Frontend
curl https://your-project.vercel.app

# API de Traduções
curl https://your-project.vercel.app/health

# Teste das traduções
curl https://your-project.vercel.app/api/i18n/translations/pt

# API de Contas
curl https://your-project.vercel.app/api/accounts/health
```

## 🔄 Auto-Deploy

- **Deploy automático** sempre que você fizer push para a branch principal
- **Preview deployments** para outras branches
- **Rollback automático** em caso de falha
- **Build otimizado** para produção

## 📊 Monitoramento

- **Analytics** em tempo real
- **Logs** detalhados
- **Performance** insights
- **Uptime monitoring**
- **Core Web Vitals** para o frontend

## 💰 Custos

- **Plano Hobby**: Gratuito
- **Bandwidth**: 100GB/mês
- **Serverless Functions**: 100GB-Hrs/mês
- **Edge Functions**: Incluídas
- **Frontend**: Incluído no plano gratuito

## 🚨 Troubleshooting

### **Erro de Build do Frontend**
- Verifique se o `vite.config.js` está correto
- Verifique se todas as dependências estão instaladas
- Verifique os logs no dashboard da Vercel

### **Erro de Build das APIs**
- Verifique se o `vercel.json` está correto
- Verifique se as dependências estão em `dependencies`
- Verifique os logs no dashboard da Vercel

### **Erro de Runtime**
- Verifique as variáveis de ambiente
- Verifique os logs das funções
- Verifique se as rotas estão configuradas corretamente

### **Erro de Conexão com Banco**
- Verifique se o `DATABASE_URL` está correto
- Verifique se o banco está acessível externamente
- Verifique se as credenciais estão corretas

## 🎯 Próximos Passos

1. **Configurar domínio personalizado** (opcional)
2. **Configurar SSL/HTTPS** (automático na Vercel)
3. **Configurar monitoramento avançado**
4. **Configurar CI/CD pipeline**
5. **Otimizar performance** do frontend

## 📞 Suporte

- **Documentação**: [vercel.com/docs](https://vercel.com/docs)
- **Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **Status**: [vercel-status.com](https://vercel-status.com)

## 🔧 Configuração Avançada

### **CLI da Vercel (Opcional)**

```bash
# Instalar CLI
npm i -g vercel

# Login
vercel login

# Deploy manual
vercel

# Deploy para produção
vercel --prod
```

### **GitHub Actions (Opcional)**

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./
```

## 🌟 **Vantagens do Deploy Completo na Vercel:**

- **Um projeto** para frontend e APIs
- **URLs organizadas** e fáceis de gerenciar
- **Deploy automático** de tudo junto
- **Performance otimizada** para ambos
- **SSL automático** para todos os serviços
- **CDN global** para o frontend
- **Serverless** para as APIs
