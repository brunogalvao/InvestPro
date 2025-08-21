# 🚀 Guia de Deploy - InvestPro APIs

Este guia mostra como fazer deploy das APIs em diferentes ambientes.

## 📋 Checklist de Preparação

### **✅ Pré-requisitos**
- [ ] Docker instalado e funcionando
- [ ] Domínio configurado (opcional)
- [ ] SSL/HTTPS configurado (recomendado)
- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados configurado
- [ ] Redis configurado

### **✅ Configurações de Segurança**
- [ ] Senhas fortes para banco de dados
- [ ] JWT_SECRET único e seguro
- [ ] CORS configurado corretamente
- [ ] Rate limiting ativado
- [ ] Health checks funcionando

## 🐳 Deploy com Docker Compose

### **1. Configuração de Produção**

Crie um arquivo `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  # Banco de dados Postgres
  postgres:
    image: postgres:16-alpine
    container_name: investpro-postgres-prod
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped
    networks:
      - investpro-network

  # Redis para cache
  redis:
    image: redis:7-alpine
    container_name: investpro-redis-prod
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped
    networks:
      - investpro-network

  # API de traduções
  i18n-api:
    build:
      context: ./i18n-api
      dockerfile: Dockerfile
    container_name: investpro-i18n-api-prod
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - REDIS_URL=redis://redis:6379
      - PORT=3000
    depends_on:
      - redis
    restart: unless-stopped
    networks:
      - investpro-network

  # API de contas
  account-api:
    build:
      context: ./account-api
      dockerfile: Dockerfile
    container_name: investpro-account-api-prod
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
      - PORT=4000
      - DATABASE_URL=postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      - BCRYPT_SALT_ROUNDS=10
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
    restart: unless-stopped
    networks:
      - investpro-network

volumes:
  redis_data:
    driver: local
  postgres_data:
    driver: local

networks:
  investpro-network:
    driver: bridge
```

### **2. Variáveis de Ambiente de Produção**

Crie um arquivo `.env.prod`:

```bash
# Produção
NODE_ENV=production
COMPOSE_PROJECT_NAME=investpro-prod

# Banco de dados
POSTGRES_USER=investpro_prod
POSTGRES_PASSWORD=SUA_SENHA_SUPER_FORTE_AQUI
POSTGRES_DB=investpro_prod

# JWT
JWT_SECRET=SUA_CHAVE_JWT_SUPER_SECRETA_AQUI
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=https://seudominio.com
```

### **3. Comandos de Deploy**

```bash
# Build de produção
./docker/scripts/build-all.sh --no-cache

# Deploy em produção
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d

# Verificar status
docker-compose -f docker-compose.prod.yml ps

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f
```

## ☁️ Deploy em Cloud

### **AWS ECS/Fargate**

1. **Criar ECR repositories:**
```bash
aws ecr create-repository --repository-name investpro-account-api
aws ecr create-repository --repository-name investpro-i18n-api
```

2. **Build e push das imagens:**
```bash
# Login no ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Tag das imagens
docker tag investpro-account-api:latest $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/investpro-account-api:latest
docker tag investpro-i18n-api:latest $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/investpro-i18n-api:latest

# Push das imagens
docker push $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/investpro-account-api:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/investpro-i18n-api:latest
```

3. **Criar task definitions e services no ECS**

### **Google Cloud Run**

1. **Build e push das imagens:**
```bash
# Build
docker build -t gcr.io/$PROJECT_ID/investpro-account-api ./account-api
docker build -t gcr.io/$PROJECT_ID/investpro-i18n-api ./i18n-api

# Push
docker push gcr.io/$PROJECT_ID/investpro-account-api
docker push gcr.io/$PROJECT_ID/investpro-i18n-api
```

2. **Deploy no Cloud Run:**
```bash
gcloud run deploy investpro-account-api \
  --image gcr.io/$PROJECT_ID/investpro-account-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

gcloud run deploy investpro-i18n-api \
  --image gcr.io/$PROJECT_ID/investpro-i18n-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## 🖥️ Deploy em VPS/Dedicated Server

### **1. Preparar o servidor:**
```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### **2. Clonar o projeto:**
```bash
git clone https://github.com/seu-usuario/investment-page.git
cd investment-page
```

### **3. Configurar variáveis de ambiente:**
```bash
cp docker/configs/env.example .env.prod
# Editar .env.prod com valores de produção
```

### **4. Deploy:**
```bash
# Build e deploy
./docker/scripts/build-all.sh
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

## 🔒 Configurações de Segurança

### **1. Nginx Reverse Proxy (Recomendado)**

Crie um arquivo `nginx.conf`:

```nginx
server {
    listen 80;
    server_name api.seudominio.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.seudominio.com;

    ssl_certificate /etc/letsencrypt/live/api.seudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.seudominio.com/privkey.pem;

    # API de contas
    location /accounts/ {
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API de traduções
    location /i18n/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### **2. SSL com Let's Encrypt:**
```bash
sudo certbot --nginx -d api.seudominio.com
```

## 📊 Monitoramento e Logs

### **1. Health Checks:**
```bash
# Verificar saúde das APIs
curl http://localhost:4000/health
curl http://localhost:3000/health
```

### **2. Logs:**
```bash
# Logs em tempo real
docker-compose logs -f account-api
docker-compose logs -f i18n-api

# Logs com timestamps
docker-compose logs -t account-api
```

### **3. Métricas:**
- **Prometheus + Grafana** para métricas
- **ELK Stack** para logs
- **AWS CloudWatch** se usar AWS

## 🔄 CI/CD Pipeline

### **GitHub Actions:**

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.KEY }}
          script: |
            cd /opt/investment-page
            git pull origin main
            ./docker/scripts/build-all.sh
            docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

## 🚨 Troubleshooting

### **Problemas Comuns:**

1. **Porta já em uso:**
```bash
sudo netstat -tulpn | grep :4000
sudo kill -9 <PID>
```

2. **Container não inicia:**
```bash
docker-compose logs account-api
docker-compose logs i18n-api
```

3. **Banco de dados não conecta:**
```bash
docker-compose exec postgres psql -U investpro -d investpro
```

## 📚 Recursos Adicionais

- [Docker Production Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
