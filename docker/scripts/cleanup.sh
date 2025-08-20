#!/bin/bash

# 🐳 Script para limpeza de containers e volumes do InvestPro
# Uso: ./docker/scripts/cleanup.sh [--all]

set -e

echo "🧹 Iniciando limpeza do ambiente Docker..."

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Inicie o Docker e tente novamente."
    exit 1
fi

# Argumentos
CLEAN_ALL=false
if [[ "$1" == "--all" ]]; then
    CLEAN_ALL=true
    echo "🔧 Limpeza completa ativada (incluindo volumes)"
fi

# Parar e remover containers
echo "🛑 Parando e removendo containers..."
docker-compose down --remove-orphans

# Remover imagens
echo "🗑️ Removendo imagens..."
docker rmi investpro-frontend:latest 2>/dev/null || true
docker rmi investpro-account-api:latest 2>/dev/null || true
docker rmi investpro-i18n-api:latest 2>/dev/null || true

# Remover containers órfãos
echo "🧹 Removendo containers órfãos..."
docker container prune -f

# Remover redes não utilizadas
echo "🌐 Removendo redes não utilizadas..."
docker network prune -f

# Remover imagens não utilizadas
echo "🖼️ Removendo imagens não utilizadas..."
docker image prune -f

if [[ "$CLEAN_ALL" == true ]]; then
    echo "💾 Removendo volumes (dados serão perdidos)..."
    docker volume rm investpro_postgres_data 2>/dev/null || true
    docker volume rm investpro_redis_data 2>/dev/null || true
    docker volume prune -f
fi

echo "✅ Limpeza concluída!"
echo ""
echo "📋 Para recomeçar do zero:"
echo "  ./docker/scripts/build-all.sh"
echo "  ./docker/scripts/start-dev.sh"
