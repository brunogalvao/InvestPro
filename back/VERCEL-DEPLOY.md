# 🚀 Deploy na Vercel - InvestPro Documentation

## 📋 **Visão Geral**

Este guia explica como fazer deploy do servidor de documentação na Vercel, tornando o Swagger acessível globalmente via internet.

## 🎯 **O que será deployado:**

- ✅ **Servidor de Documentação** com interface moderna
- ✅ **Swagger UI** para Account API e i18n API
- ✅ **Documentação Estática** interativa
- ✅ **Status das APIs** em tempo real
- ✅ **Interface responsiva** para mobile e desktop

## 🚀 **Deploy Automático (Recomendado)**

### 1. **Executar Script de Deploy:**
```bash
cd back
./deploy-vercel.sh
```

### 2. **Responder às Perguntas do Vercel:**
```
? Project name: investpro-docs (ou deixe vazio)
? Directory: ./ (deixe vazio)
? Override settings: No (deixe vazio)
```

### 3. **Aguardar Deploy:**
O Vercel fará o deploy automaticamente e fornecerá uma URL.

## 🔧 **Deploy Manual**

### 1. **Instalar Vercel CLI:**
```bash
npm install -g vercel
```

### 2. **Fazer Login:**
```bash
vercel login
```

### 3. **Preparar Arquivos:**
```bash
# Copiar package.json específico
cp package-docs.json package.json

# Instalar dependências
npm install
```

### 4. **Fazer Deploy:**
```bash
vercel --prod
```

## 📁 **Arquivos de Deploy**

| Arquivo | Descrição | Status |
|---------|-----------|--------|
| `docs-server.js` | Servidor principal | ✅ Pronto |
| `package-docs.json` | Dependências | ✅ Configurado |
| `vercel-docs.json` | Configuração Vercel | ✅ Configurado |
| `deploy-vercel.sh` | Script de deploy | ✅ Executável |
| `.vercelignore` | Arquivos ignorados | ✅ Criado automaticamente |

## 🌐 **URLs após Deploy**

Após o deploy, você terá acesso a:

- **📖 Menu Principal**: `https://seu-projeto.vercel.app/`
- **🔐 Account API Swagger**: `https://seu-projeto.vercel.app/docs/account`
- **🌍 i18n API Swagger**: `https://seu-projeto.vercel.app/docs/i18n`
- **📚 Documentação Estática**: `https://seu-projeto.vercel.app/docs/static`

## 🔄 **Atualizações**

### **Atualizar Deploy:**
```bash
./deploy-vercel.sh
```

### **Ou manualmente:**
```bash
vercel --prod
```

## 📱 **Recursos da Interface**

### **Design Responsivo:**
- ✅ **Mobile-first** design
- ✅ **Gradientes modernos** e animações
- ✅ **Cards interativos** com hover effects
- ✅ **Status das APIs** em tempo real

### **Funcionalidades:**
- ✅ **Swagger UI** completo para ambas as APIs
- ✅ **Health checks** automáticos
- ✅ **Download** de documentação em Markdown
- ✅ **Navegação intuitiva** entre seções

## 🔍 **Troubleshooting**

### **Erro: "Vercel CLI not found"**
```bash
npm install -g vercel
```

### **Erro: "Not logged in"**
```bash
vercel login
```

### **Erro: "Build failed"**
```bash
# Verificar dependências
npm install

# Verificar Node.js version (>=18)
node --version
```

### **Erro: "Port already in use"**
```bash
# Parar processo anterior
pkill -f "docs-server.js"

# Tentar novamente
./deploy-vercel.sh
```

## 🌟 **Vantagens do Deploy na Vercel**

1. **🌐 Acesso Global**: Documentação disponível de qualquer lugar
2. **🚀 Deploy Automático**: Atualizações com um comando
3. **📱 Responsivo**: Funciona perfeitamente em mobile
4. **🔒 HTTPS**: Segurança automática
5. **⚡ Performance**: CDN global da Vercel
6. **🔄 CI/CD**: Integração com GitHub para deploys automáticos

## 📚 **Próximos Passos (Opcional)**

### **1. Configurar Domínio Personalizado:**
- Acesse o dashboard da Vercel
- Vá em Settings → Domains
- Adicione seu domínio personalizado

### **2. Configurar Deploy Automático:**
- Conecte o repositório GitHub
- Configure deploys automáticos em push

### **3. Monitoramento:**
- Acesse Analytics no dashboard
- Monitore performance e uso

### **4. Customizações:**
- Personalizar cores do Swagger
- Adicionar logo da empresa
- Configurar temas dark/light

## 🎉 **Resultado Final**

Após o deploy, você terá:

✅ **Documentação global** acessível via internet  
✅ **Swagger UI profissional** para suas APIs  
✅ **Interface moderna** e responsiva  
✅ **Deploy automático** via Vercel  
✅ **URL pública** para compartilhar com a equipe  

---

**🚀 Sua documentação está pronta para o mundo!**

Execute `./deploy-vercel.sh` e compartilhe a URL com sua equipe de desenvolvimento.
