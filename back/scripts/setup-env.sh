#!/bin/bash

# ========================================
# 🔧 SETUP DAS VARIÁVEIS DE AMBIENTE
# ========================================

echo "🔧 Configurando variáveis de ambiente..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para gerar JWT secret
generate_jwt_secret() {
    if command -v openssl &> /dev/null; then
        openssl rand -base64 32
    else
        echo "jwt_secret_$(date +%s)_$(head /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)"
    fi
}

# Função para configurar variável
setup_variable() {
    local var_name="$1"
    local description="$2"
    local default_value="$3"
    local is_secret="$4"
    
    echo -e "\n${BLUE}🔧 $description${NC}"
    
    if [ "$is_secret" = "true" ]; then
        read -s -p "Digite o valor para $var_name (deixe em branco para usar padrão): " value
        echo
    else
        read -p "Digite o valor para $var_name (deixe em branco para usar padrão): " value
    fi
    
    if [ -z "$value" ]; then
        value="$default_value"
    fi
    
    echo "$var_name=$value" >> .env
    echo -e "${GREEN}✅ $var_name configurado${NC}"
}

# Verificar se já existe arquivo .env
if [ -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Arquivo .env já existe. Deseja sobrescrever? (y/N)${NC}"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        rm .env
        echo -e "${GREEN}✅ Arquivo .env removido${NC}"
    else
        echo -e "${YELLOW}⚠️  Configuração cancelada${NC}"
        exit 0
    fi
fi

# Criar arquivo .env
echo "# ========================================" > .env
echo "# 🌍 INVESTPRO BACKEND - VARIÁVEIS DE AMBIENTE" >> .env
echo "# ========================================" >> .env
echo "" >> .env

# Configurar variáveis básicas
echo -e "${BLUE}🚀 Configurando ambiente...${NC}"
echo "NODE_ENV=development" >> .env
echo "LOG_LEVEL=info" >> .env
echo "REQUEST_TIMEOUT=30000" >> .env
echo "" >> .env

# Configurar JWT Secret
jwt_secret=$(generate_jwt_secret)
echo "JWT_SECRET=$jwt_secret" >> .env
echo "BCRYPT_SALT_ROUNDS=10" >> .env
echo "JWT_EXPIRES_IN=24h" >> .env
echo "" >> .env

# Configurar CORS
echo -e "${BLUE}🌐 Configurando CORS...${NC}"
echo "CORS_ORIGIN=http://localhost:5173,http://localhost:3000" >> .env
echo "" >> .env

# Configurar Database
echo -e "${BLUE}🗄️  Configurando Database...${NC}"
echo "Para PostgreSQL, você pode usar:"
echo "  - Neon (gratuito): https://neon.tech"
echo "  - Vercel Postgres (gratuito): https://vercel.com/docs/storage/vercel-postgres"
echo ""

setup_variable "DATABASE_URL" "URL do banco PostgreSQL" "postgres://user:password@host:port/database?sslmode=require" false

# Configurar Redis
echo -e "${BLUE}🔴 Configurando Redis...${NC}"
echo "Para Redis, você pode usar:"
echo "  - Upstash (gratuito): https://upstash.com"
echo "  - Vercel KV (gratuito): https://vercel.com/docs/storage/vercel-kv"
echo ""

setup_variable "KV_URL" "URL do Redis (Vercel KV)" "rediss://default:token@host:port" false
setup_variable "REDIS_URL" "URL alternativa do Redis" "rediss://default:token@host:port" false
echo "REDIS_TLS=true" >> .env

# Configurar Upstash (opcional)
echo -e "${BLUE}📊 Configurando Upstash (opcional)...${NC}"
setup_variable "KV_REST_API_URL" "URL da API REST do Upstash" "https://seu-projeto.upstash.io" false
setup_variable "KV_REST_API_TOKEN" "Token da API REST do Upstash" "seu_token_aqui" true

echo "" >> .env
echo "# ========================================" >> .env
echo "# ✅ CONFIGURAÇÃO CONCLUÍDA" >> .env
echo "# ========================================" >> .env

echo -e "\n${GREEN}🎉 Configuração concluída!${NC}"
echo -e "\n${BLUE}📋 Próximos passos:${NC}"
echo "1. Verifique o arquivo .env criado"
echo "2. Configure as URLs reais do seu banco e Redis"
echo "3. Execute: npm run dev nas pastas das APIs"
echo "4. Teste com: ./scripts/test-apis.sh"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANTE:${NC}"
echo "- Nunca commite o arquivo .env no git"
echo "- Use .env.example para documentar as variáveis"
echo "- Configure as variáveis de produção no Vercel"
