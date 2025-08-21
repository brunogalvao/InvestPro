#!/bin/bash

# 🧪 Script para testar o backend da InvestPro
# Uso: ./scripts/test-backend.sh

set -e

BASE_URL="https://invest-pro-42u1.vercel.app"

echo "🧪 Iniciando testes do backend..."
echo "🌐 URL Base: $BASE_URL"
echo ""

# Função para testar endpoint
test_endpoint() {
    local name=$1
    local url=$2
    local method=${3:-GET}
    
    echo "🔍 Testando: $name"
    echo "   URL: $url"
    echo "   Método: $method"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$url")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$url")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -eq 200 ]; then
        echo "   ✅ Status: $http_code (SUCCESS)"
        echo "   📄 Resposta: ${body:0:100}..."
    else
        echo "   ❌ Status: $http_code (ERROR)"
        echo "   📄 Resposta: $body"
    fi
    echo ""
}

# Testes básicos
echo "📋 TESTES BÁSICOS (Health Checks)"
echo "=================================="
test_endpoint "Health Geral" "$BASE_URL/health"
test_endpoint "Health Account API" "$BASE_URL/api/accounts/health"
test_endpoint "Health i18n API" "$BASE_URL/api/i18n/health"

# Testes das APIs
echo "📋 TESTES DAS APIS"
echo "=================="

echo "🌐 i18n API - Traduções"
test_endpoint "Traduções PT" "$BASE_URL/api/i18n/translations/pt"
test_endpoint "Traduções EN" "$BASE_URL/api/i18n/translations/en"
test_endpoint "Cotação USD/BRL" "$BASE_URL/api/i18n/exchange-rate"

echo "🏦 Account API - Autenticação"
test_endpoint "Registro Usuário" "$BASE_URL/api/accounts/auth/register" "POST"
test_endpoint "Login Usuário" "$BASE_URL/api/accounts/auth/login" "POST"

echo ""
echo "🎉 Testes concluídos!"
echo ""
echo "📊 Resumo:"
echo "  - Health checks devem retornar 200"
echo "  - APIs devem responder corretamente"
echo "  - Verifique os logs para erros específicos"
