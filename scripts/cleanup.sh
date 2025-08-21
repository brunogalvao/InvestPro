#!/bin/bash

# 🧹 Script para limpeza completa do ambiente Docker
# Uso: ./scripts/cleanup.sh

set -e

echo "🧹 Iniciando limpeza do ambiente Docker..."

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando."
    exit 1
fi

# Parar todos os containers
echo "🛑 Parando todos os containers..."
docker-compose down

# Remover containers parados
echo "🗑️ Removendo containers parados..."
docker container prune -f

# Remover imagens não utilizadas
echo "🗑️ Removendo imagens não utilizadas..."
docker image prune -f

# Remover volumes não utilizados
echo "🗑️ Removendo volumes não utilizados..."
docker volume prune -f

# Remover redes não utilizadas
echo "🗑️ Removendo redes não utilizadas..."
docker network prune -f

# Limpeza completa do sistema
echo "🧹 Limpeza completa do sistema Docker..."
docker system prune -f

echo ""
echo "✅ Limpeza concluída!"
echo ""
echo "📋 Para iniciar novamente:"
echo "  ./scripts/start-dev.sh"
