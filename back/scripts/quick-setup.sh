#!/bin/bash

# ========================================
# 🚀 QUICK SETUP - INVESTPRO BACKEND
# ========================================

echo "🚀 Iniciando setup rápido do backend..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para verificar se comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Função para aguardar API
wait_for_api() {
    local url="$1"
    local name="$2"
    local max_attempts=30
    local attempt=1
    
    echo -e "\n${BLUE}⏳ Aguardando $name...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $name está rodando!${NC}"
            return 0
        fi
        
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo -e "\n${RED}❌ $name não iniciou em tempo hábil${NC}"
    return 1
}

# Verificar dependências
echo -e "\n${BLUE}🔍 Verificando dependências...${NC}"

if ! command_exists node; then
    echo -e "${RED}❌ Node.js não encontrado. Instale o Node.js primeiro.${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm não encontrado. Instale o npm primeiro.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js e npm encontrados${NC}"

# Verificar se arquivo .env existe
if [ ! -f ".env" ]; then
    echo -e "\n${YELLOW}⚠️  Arquivo .env não encontrado${NC}"
    echo "Copiando arquivo de exemplo..."
    if [ -f "env.config" ]; then
        cp env.config .env
        echo -e "${GREEN}✅ Arquivo .env criado${NC}"
        echo -e "${YELLOW}⚠️  Configure as variáveis de ambiente no arquivo .env${NC}"
    else
        echo -e "${RED}❌ Arquivo env.config não encontrado${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Arquivo .env encontrado${NC}"
fi

# Instalar dependências
echo -e "\n${BLUE}📦 Instalando dependências...${NC}"

echo "Instalando dependências da Account API..."
cd account-api
npm install
cd ..

echo "Instalando dependências da i18n API..."
cd i18n-api
npm install
cd ..

echo -e "${GREEN}✅ Dependências instaladas${NC}"

# Iniciar APIs em background
echo -e "\n${BLUE}🚀 Iniciando APIs...${NC}"

echo "Iniciando Account API na porta 4000..."
cd account-api
npm run dev > ../logs/account-api.log 2>&1 &
ACCOUNT_PID=$!
cd ..

echo "Iniciando i18n API na porta 3000..."
cd i18n-api
npm run dev > ../logs/i18n-api.log 2>&1 &
I18N_PID=$!
cd ..

# Criar diretório de logs se não existir
mkdir -p logs

# Aguardar APIs iniciarem
wait_for_api "http://localhost:4000/health" "Account API"
wait_for_api "http://localhost:3000/health" "i18n API"

# Verificar status
echo -e "\n${BLUE}📊 Status das APIs:${NC}"

if curl -s "http://localhost:4000/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Account API: http://localhost:4000${NC}"
else
    echo -e "${RED}❌ Account API: Não está rodando${NC}"
fi

if curl -s "http://localhost:3000/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ i18n API: http://localhost:3000${NC}"
else
    echo -e "${RED}❌ i18n API: Não está rodando${NC}"
fi

# Executar testes básicos
echo -e "\n${BLUE}🧪 Executando testes básicos...${NC}"
./scripts/test-apis.sh

echo -e "\n${GREEN}🎉 Setup concluído!${NC}"
echo -e "\n${BLUE}📋 Próximos passos:${NC}"
echo "1. Configure as variáveis de ambiente no arquivo .env"
echo "2. Configure o banco de dados PostgreSQL"
echo "3. Configure o Redis/Upstash"
echo "4. Teste as funcionalidades"
echo "5. Deploy para produção"

echo -e "\n${BLUE}🔗 URLs das APIs:${NC}"
echo "Account API: http://localhost:4000"
echo "i18n API: http://localhost:3000"
echo "Health Check: http://localhost:4000/health e http://localhost:3000/health"

echo -e "\n${BLUE}📁 Logs:${NC}"
echo "Account API: logs/account-api.log"
echo "i18n API: logs/i18n-api.log"

echo -e "\n${YELLOW}⚠️  Para parar as APIs:${NC}"
echo "kill $ACCOUNT_PID $I18N_PID"
