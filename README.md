# 🚀 InvestPro - Plataforma de Investimentos

Plataforma moderna de investimentos com arquitetura de microserviços, frontend React e APIs backend escaláveis.

## 🏗️ Arquitetura

```
investment-page/
├── front/                 # Frontend React + Vite
│   ├── src/              # Código fonte React
│   ├── public/           # Arquivos estáticos
│   └── package.json      # Dependências frontend
├── back/                  # Backend APIs
│   ├── account-api/      # API de autenticação e contas
│   ├── i18n-api/         # API de traduções
│   └── docker/           # Configurações Docker backend
├── docker-compose.yml     # Orquestração principal
└── scripts/               # Scripts de automação
```

## 🚀 Início Rápido

### Pré-requisitos
- Docker Desktop
- Node.js 18+
- pnpm (recomendado)

### 1. Iniciar Ambiente Completo
```bash
# Iniciar todos os serviços
./scripts/start-dev.sh

# Ou manualmente
docker-compose up -d
```

### 2. Desenvolvimento Local

#### **Opção A: Scripts Automatizados (Recomendado)**
```bash
# Desenvolvimento apenas do frontend
cd front && ./scripts/dev-frontend.sh

# Desenvolvimento das APIs backend
cd back && ./scripts/dev-apis.sh
```

#### **Opção B: Comandos Manuais**
```bash
# Frontend
cd front && npm run dev

# Account API
cd back/account-api && npm run dev

# i18n API
cd back/i18n-api && npm run dev
```

## 🌐 Serviços Disponíveis

| Serviço | Porta | Descrição |
|---------|-------|-----------|
| Frontend | 5173 | Aplicação React |
| Account API | 4000 | Autenticação e contas |
| i18n API | 3000 | Traduções e internacionalização |
| PostgreSQL | 5432 | Banco de dados principal |
| Redis | 6379 | Cache e sessões |

## 🐳 Comandos Docker

### Scripts Disponíveis
```bash
./scripts/start-dev.sh      # Iniciar ambiente
./scripts/build-all.sh       # Build de todas as imagens
./scripts/cleanup.sh         # Limpeza completa
```

### Comandos Manuais
```bash
# Iniciar
docker-compose up -d

# Parar
docker-compose down

# Ver logs
docker-compose logs -f

# Rebuild
docker-compose up -d --build
```

## 🚀 Deploy

### Vercel (Frontend)
```bash
cd front
vercel --prod
```

### Render (Backend APIs)
```bash
# Configurado via render.yaml
# Deploy automático via GitHub
```

### Docker Compose (Produção)
```bash
docker-compose -f front/docker-compose.prod.yml up -d
```

## 🔧 Desenvolvimento

### Estrutura de APIs
- **Account API**: Fastify + PostgreSQL + JWT
- **i18n API**: Express + Redis + Cache
- **Frontend**: React + Vite + Tailwind CSS

### Variáveis de Ambiente

#### **Configuração Rápida**
```bash
# Copiar arquivo de exemplo
cp env.example .env

# Ajustar valores conforme necessário
```

#### **Variáveis Principais**
```bash
# Frontend
VITE_I18N_API_URL=http://localhost:3000
VITE_ACCOUNT_API_URL=http://localhost:4000

# Account API
DATABASE_URL=postgres://investpro:investpro@postgres:5432/investpro
BCRYPT_SALT_ROUNDS=10
JWT_SECRET=your-super-secret-jwt-key-here

# i18n API
REDIS_URL=redis://redis:6379
```

> 📝 **Nota**: Veja `env.example` para todas as variáveis disponíveis

## 📋 Scripts Úteis

### Desenvolvimento
```bash
# Iniciar ambiente completo
./scripts/start-dev.sh

# Desenvolvimento frontend (script automatizado)
cd front && ./scripts/dev-frontend.sh

# Desenvolvimento APIs backend (script automatizado)
cd back && ./scripts/dev-apis.sh

# Desenvolvimento manual
cd front && npm run dev
cd back/account-api && npm run dev
cd back/i18n-api && npm run dev
```

### Build e Deploy
```bash
# Build todas as imagens
./scripts/build-all.sh

# Build sem cache
./scripts/build-all.sh --no-cache

# Limpeza completa
./scripts/cleanup.sh
```

## 🎯 Benefícios da Nova Arquitetura

✅ **Separação Clara**: Frontend e backend completamente separados  
✅ **Microserviços**: APIs independentes e escaláveis  
✅ **Deploy Flexível**: Diferentes plataformas para diferentes serviços  
✅ **Desenvolvimento Local**: Ambiente Docker completo e isolado  
✅ **Escalabilidade**: Cada serviço pode ser escalado independentemente  
✅ **Manutenibilidade**: Código organizado e fácil de manter  

## 🆘 Troubleshooting

### Docker não inicia
```bash
# Verificar se Docker Desktop está rodando
open -a Docker

# Aguardar inicialização completa
sleep 30
```

### Portas em uso
```bash
# Parar todos os serviços
./scripts/cleanup.sh

# Iniciar novamente
./scripts/start-dev.sh
```

### Problemas de build
```bash
# Rebuild sem cache
./scripts/build-all.sh --no-cache

# Ou via docker-compose
docker-compose up -d --build
```

---

**Desenvolvido com ❤️ pela equipe InvestPro** 🚀
