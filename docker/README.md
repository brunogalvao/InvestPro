# 🐳 Estrutura Docker - InvestPro

Este projeto utiliza uma arquitetura de microservices com Docker para separar as responsabilidades e facilitar o desenvolvimento e deploy.

## 📁 Estrutura de Arquivos

```
docker/
├── README.md                   # Esta documentação
├── scripts/                    # Scripts de automação
│   ├── build-all.sh           # Build de todos os containers
│   ├── start-dev.sh           # Iniciar ambiente de desenvolvimento
│   ├── start-prod.sh          # Iniciar ambiente de produção
│   └── cleanup.sh             # Limpar containers e volumes
└── configs/                    # Configurações Docker
    ├── .env.example           # Exemplo de variáveis de ambiente
    └── docker-compose.override.yml  # Override para desenvolvimento
```

## 🏗️ Arquitetura dos Serviços

### **Frontend (React)**
- **Porta**: 5173
- **Container**: `investpro-frontend`
- **Contexto**: Raiz do projeto
- **Dockerfile**: `Dockerfile.frontend`

### **API de Contas**
- **Porta**: 4000
- **Container**: `investpro-account-api`
- **Contexto**: `./account-api/`
- **Dependências**: PostgreSQL

### **API de Traduções (i18n)**
- **Porta**: 3000
- **Container**: `investpro-i18n-api`
- **Contexto**: `./i18n-api/`
- **Dependências**: Redis

### **Banco de Dados**
- **Porta**: 5432
- **Container**: `investpro-postgres`
- **Imagem**: `postgres:16-alpine`

### **Cache Redis**
- **Porta**: 6379
- **Container**: `investpro-redis`
- **Imagem**: `redis:7-alpine`

## 🚀 Comandos Principais

### **Desenvolvimento**
```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs em tempo real
docker-compose logs -f

# Rebuild de um serviço específico
docker-compose build account-api
```

### **Produção**
```bash
# Build de produção
docker-compose -f docker-compose.yml -f docker/configs/docker-compose.override.yml up -d

# Parar todos os serviços
docker-compose down
```

## 🔧 Configurações

### **Variáveis de Ambiente**
- `.env` - Configurações locais (não commitado)
- `.env.example` - Exemplo de configurações

### **Networks**
- `investpro-network` - Rede padrão para comunicação entre serviços

### **Volumes**
- `postgres_data` - Dados persistentes do PostgreSQL
- `redis_data` - Dados persistentes do Redis

## 📋 Checklist de Deploy

- [ ] Configurar variáveis de ambiente
- [ ] Build dos containers
- [ ] Verificar healthchecks
- [ ] Testar comunicação entre serviços
- [ ] Configurar volumes persistentes
- [ ] Configurar restart policies

## 🐛 Troubleshooting

### **Problemas Comuns**
1. **Porta já em uso**: Verificar se não há outros serviços rodando
2. **Build falhou**: Verificar dependências e Dockerfile
3. **Healthcheck falhou**: Verificar logs do serviço

### **Logs Úteis**
```bash
# Logs de um serviço específico
docker-compose logs account-api

# Logs com timestamps
docker-compose logs -t account-api

# Últimas 100 linhas
docker-compose logs --tail=100 account-api
```

## 🔄 Atualizações

Para atualizar um serviço:
1. Fazer alterações no código
2. Rebuild do container: `docker-compose build service-name`
3. Restart do serviço: `docker-compose restart service-name`

## 📚 Recursos Adicionais

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Microservices Architecture](https://microservices.io/)
