#!/bin/bash

# ========================================
# 🧪 TESTE DAS APIS - INVESTPRO BACKEND
# ========================================

echo "🚀 Iniciando testes das APIs..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para testar endpoint
test_endpoint() {
    local name="$1"
    local url="$2"
    local method="${3:-GET}"
    local data="${4:-}"
    
    echo -e "\n${BLUE}🔍 Testando: $name${NC}"
    echo "URL: $url"
    echo "Método: $method"
    
    if [ "$method" = "POST" ] && [ -n "$data" ]; then
        echo "Dados: $data"
        response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST -H "Content-Type: application/json" -d "$data" "$url")
    else
        response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X "$method" "$url")
    fi
    
    # Separar response body e status
    http_status=$(echo "$response" | tail -n1 | sed 's/.*HTTP_STATUS://')
    response_body=$(echo "$response" | sed '$d')
    
    if [ "$http_status" -ge 200 ] && [ "$http_status" -lt 300 ]; then
        echo -e "${GREEN}✅ Sucesso! Status: $http_status${NC}"
        echo "Resposta: $response_body" | jq '.' 2>/dev/null || echo "Resposta: $response_body"
    else
        echo -e "${RED}❌ Falha! Status: $http_status${NC}"
        echo "Resposta: $response_body"
    fi
    
    echo "----------------------------------------"
}

# Verificar se as APIs estão rodando
echo -e "\n${YELLOW}📡 Verificando se as APIs estão rodando...${NC}"

# Testar Account API
if curl -s "http://localhost:4000/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Account API está rodando na porta 4000${NC}"
    ACCOUNT_API_URL="http://localhost:4000"
else
    echo -e "${RED}❌ Account API não está rodando na porta 4000${NC}"
    ACCOUNT_API_URL=""
fi

# Testar i18n API
if curl -s "http://localhost:3000/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ i18n API está rodando na porta 3000${NC}"
    I18N_API_URL="http://localhost:3000"
else
    echo -e "${RED}❌ i18n API não está rodando na porta 3000${NC}"
    I18N_API_URL=""
fi

if [ -z "$ACCOUNT_API_URL" ] && [ -z "$I18N_API_URL" ]; then
    echo -e "\n${RED}❌ Nenhuma API está rodando!${NC}"
    echo "Execute os seguintes comandos para iniciar as APIs:"
    echo "1. cd back/account-api && npm run dev"
    echo "2. cd back/i18n-api && npm run dev"
    exit 1
fi

echo -e "\n${YELLOW}🧪 Executando testes...${NC}"

# Testes da Account API
if [ -n "$ACCOUNT_API_URL" ]; then
    echo -e "\n${BLUE}🏦 TESTES DA ACCOUNT API${NC}"
    
    # Health check
    test_endpoint "Health Check" "$ACCOUNT_API_URL/health"
    
    # Teste de registro (deve falhar sem dados válidos)
    test_endpoint "Registro (sem dados)" "$ACCOUNT_API_URL/auth/register" "POST" '{}'
    
    # Teste de login (deve falhar sem dados válidos)
    test_endpoint "Login (sem dados)" "$ACCOUNT_API_URL/auth/login" "POST" '{}'
    
    # Listar contas (deve falhar sem autenticação)
    test_endpoint "Listar contas (sem auth)" "$ACCOUNT_API_URL/accounts"
fi

# Testes da i18n API
if [ -n "$I18N_API_URL" ]; then
    echo -e "\n${BLUE}🌍 TESTES DA I18N API${NC}"
    
    # Health check
    test_endpoint "Health Check" "$I18N_API_URL/health"
    
    # Listar idiomas
    test_endpoint "Listar idiomas" "$I18N_API_URL/api/languages"
    
    # Buscar traduções em inglês
    test_endpoint "Traduções EN" "$I18N_API_URL/api/translations/en"
    
    # Buscar traduções em português
    test_endpoint "Traduções PT" "$I18N_API_URL/api/translations/pt"
    
    # Cotação do dólar
    test_endpoint "Cotação USD/BRL" "$I18N_API_URL/api/exchange-rate"
    
    # Cotação com cache
    test_endpoint "Cotação com cache" "$I18N_API_URL/api/exchange-rate/cached"
fi

echo -e "\n${GREEN}🎉 Testes concluídos!${NC}"

# Verificar variáveis de ambiente
echo -e "\n${YELLOW}🔧 Verificando variáveis de ambiente...${NC}"

if [ -f "../env.example" ]; then
    echo -e "${GREEN}✅ Arquivo env.example encontrado${NC}"
    echo "Configure suas variáveis de ambiente baseado neste arquivo"
else
    echo -e "${YELLOW}⚠️  Arquivo env.example não encontrado${NC}"
fi

echo -e "\n${BLUE}📋 Próximos passos:${NC}"
echo "1. Configure as variáveis de ambiente no arquivo .env"
echo "2. Configure o banco de dados PostgreSQL"
echo "3. Configure o Redis/Upstash para cache"
echo "4. Teste novamente com dados válidos"
echo "5. Deploy para produção"
