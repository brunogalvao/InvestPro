#!/bin/bash

# 🚀 Script para desenvolvimento das APIs backend
# Uso: ./scripts/dev-apis.sh

set -e

echo "🚀 Iniciando desenvolvimento das APIs backend..."

# Verificar se estamos no diretório correto
if [ ! -d "account-api" ] || [ ! -d "i18n-api" ]; then
    echo "❌ Execute este script do diretório back/"
    exit 1
fi

# Função para instalar dependências
install_deps() {
    local api_name=$1
    local api_path=$2
    
    echo "📦 Instalando dependências de $api_name..."
    cd "$api_path"
    
    if [ ! -d "node_modules" ]; then
        npm install
    fi
    
    cd - > /dev/null
}

# Função para iniciar API
start_api() {
    local api_name=$1
    local api_path=$2
    local port=$3
    
    echo "🚀 Iniciando $api_name na porta $port..."
    cd "$api_path"
    
    # Iniciar em background
    npm run dev &
    local pid=$!
    
    echo "✅ $api_name iniciado com PID: $pid"
    cd - > /dev/null
    
    # Retornar PID
    echo $pid
}

# Instalar dependências
install_deps "Account API" "account-api"
install_deps "i18n API" "i18n-api"

# Iniciar APIs
echo ""
echo "🚀 Iniciando APIs..."
account_pid=$(start_api "Account API" "account-api" "4000")
i18n_pid=$(start_api "i18n API" "i18n-api" "3000")

echo ""
echo "✅ Todas as APIs iniciadas!"
echo ""
echo "🌐 URLs disponíveis:"
echo "  - Account API: http://localhost:4000"
echo "  - i18n API: http://localhost:3000"
echo ""
echo "📋 PIDs das APIs:"
echo "  - Account API: $account_pid"
echo "  - i18n API: $i18n_pid"
echo ""
echo "🛑 Para parar as APIs:"
echo "  kill $account_pid $i18n_pid"
echo ""
echo "⏳ Pressione Ctrl+C para parar todas as APIs..."

# Função de limpeza
cleanup() {
    echo ""
    echo "🛑 Parando APIs..."
    kill $account_pid $i18n_pid 2>/dev/null || true
    echo "✅ APIs paradas"
    exit 0
}

# Capturar Ctrl+C
trap cleanup SIGINT

# Manter script rodando
wait
