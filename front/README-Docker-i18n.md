# 🐳 Docker i18n para InvestPro

Sistema completo de internacionalização usando Docker com Redis e API Node.js.

## 🏗️ **Arquitetura**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   i18n API      │    │     Redis       │
│   React         │◄──►│   Node.js       │◄──►│   Cache         │
│   Porta 5173    │    │   Porta 3000    │    │   Porta 6379    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 **Como usar**

### **1. Iniciar todos os serviços:**
```bash
./scripts/docker-i18n.sh start
```

### **2. Parar todos os serviços:**
```bash
./scripts/docker-i18n.sh stop
```

### **3. Ver logs em tempo real:**
```bash
./scripts/docker-i18n.sh logs
```

### **4. Ver status dos serviços:**
```bash
./scripts/docker-i18n.sh status
```

### **5. Testar API:**
```bash
./scripts/docker-i18n.sh test
```

## 📚 **Endpoints da API**

### **GET** `/api/translations/:lang`
- **Descrição**: Obter traduções de um idioma
- **Exemplo**: `GET /api/translations/pt`
- **Resposta**: JSON com todas as traduções

### **PUT** `/api/translations/:lang`
- **Descrição**: Atualizar traduções de um idioma
- **Exemplo**: `PUT /api/translations/pt`
- **Body**: JSON com traduções atualizadas

### **POST** `/api/translations`
- **Descrição**: Adicionar novo idioma
- **Body**: `{ "lang": "es", "translations": {...} }`

### **DELETE** `/api/translations/:lang`
- **Descrição**: Remover idioma
- **Exemplo**: `DELETE /api/translations/es`

### **GET** `/api/languages`
- **Descrição**: Listar idiomas disponíveis
- **Resposta**: Array com códigos dos idiomas

### **GET** `/health`
- **Descrição**: Health check da API
- **Resposta**: Status da aplicação

## 🔧 **Configuração**

### **Variáveis de ambiente:**
```bash
# API de Traduções
VITE_I18N_API_URL=http://localhost:3000

# Redis
REDIS_URL=redis://localhost:6379

# Portas
I18N_API_PORT=3000
REDIS_PORT=6379
FRONTEND_PORT=5173
```

### **Portas utilizadas:**
- **Frontend**: 5173
- **i18n API**: 3000
- **Redis**: 6379

## 📱 **Uso no Frontend**

### **Hook personalizado:**
```javascript
import { useI18nAPI } from './hooks/useI18nAPI';

function App() {
  const { translations, loading, changeLanguage } = useI18nAPI('pt');
  
  if (loading) return <div>Carregando...</div>;
  
  return (
    <div>
      <h1>{translations.title}</h1>
      <button onClick={() => changeLanguage('en')}>
        English
      </button>
    </div>
  );
}
```

## 🗄️ **Persistência de dados**

- **Redis**: Dados persistidos em volume Docker
- **Traduções**: Inicializadas automaticamente na primeira execução
- **Backup**: Volume `redis_data` mantém dados entre restarts

## 🧪 **Testando a API**

### **1. Health check:**
```bash
curl http://localhost:3000/health
```

### **2. Obter traduções em português:**
```bash
curl http://localhost:3000/api/translations/pt
```

### **3. Obter traduções em inglês:**
```bash
curl http://localhost:3000/api/translations/en
```

### **4. Listar idiomas disponíveis:**
```bash
curl http://localhost:3000/api/languages
```

## 🚨 **Troubleshooting**

### **Problema**: API não responde
```bash
# Verificar se containers estão rodando
docker-compose ps

# Ver logs da API
docker-compose logs i18n-api

# Reiniciar serviços
./scripts/docker-i18n.sh restart
```

### **Problema**: Redis não conecta
```bash
# Verificar logs do Redis
docker-compose logs redis

# Verificar se porta está livre
lsof -i :6379
```

### **Problema**: Frontend não carrega traduções
```bash
# Verificar se API está rodando
curl http://localhost:3000/health

# Verificar variáveis de ambiente
echo $VITE_I18N_API_URL
```

## 🔄 **Desenvolvimento**

### **Modo desenvolvimento:**
```bash
# Construir imagens
./scripts/docker-i18n.sh build

# Iniciar com logs
docker-compose up

# Em outro terminal, ver logs
./scripts/docker-i18n.sh logs
```

### **Adicionar novo idioma:**
```bash
# Exemplo: Adicionar espanhol
curl -X POST http://localhost:3000/api/translations \
  -H "Content-Type: application/json" \
  -d '{
    "lang": "es",
    "translations": {
      "title": "InvestPro",
      "subtitle": "Plataforma de Inversiones Inteligente"
    }
  }'
```

## 📈 **Benefícios**

- ✅ **Escalabilidade**: Redis permite cache distribuído
- ✅ **Performance**: Traduções em memória
- ✅ **Flexibilidade**: API REST para gerenciar traduções
- ✅ **Persistência**: Dados mantidos entre restarts
- ✅ **Desenvolvimento**: Hot reload e logs em tempo real
- ✅ **Produção**: Containers isolados e seguros

## 🎯 **Próximos passos**

1. **Implementar autenticação** na API
2. **Adicionar cache TTL** no Redis
3. **Criar interface admin** para traduções
4. **Implementar versionamento** de traduções
5. **Adicionar validação** de schemas JSON
6. **Criar testes automatizados**

---

**🎉 Agora você tem um sistema completo de i18n com Docker!**
