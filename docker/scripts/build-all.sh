#!/bin/bash

# 🐳 Script para build de todos os containers do InvestPro
# Uso: ./docker/scripts/build-all.sh [--no-cache]

set -e

echo "🚀 Iniciando build de todos os containers..."

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Inicie o Docker e tente novamente."
    exit 1
fi

# Argumentos
NO_CACHE=""
if [[ "$1" == "--no-cache" ]]; then
    NO_CACHE="--no-cache"
    echo "🔧 Build sem cache ativado"
fi

# Build do frontend
echo "📦 Build do frontend..."
docker build -f Dockerfile.frontend -t investpro-frontend:latest . $NO_CACHE

# Build da API de contas
echo "🏦 Build da API de contas..."
docker build -f account-api/Dockerfile -t investpro-account-api:latest ./account-api $NO_CACHE

# Build da API de traduções
echo "🌐 Build da API de traduções..."
docker build -f i18n-api/Dockerfile -t investpro-i18n-api:latest ./i18n-api $NO_CACHE

echo "✅ Build de todos os containers concluído!"
echo ""
echo "📋 Containers disponíveis:"
echo "  - investpro-frontend:latest"
echo "  - investpro-account-api:latest"
echo "  - investpro-i18n-api:latest"
echo ""
echo "🚀 Para iniciar os serviços:"
echo "  docker-compose up -d"
