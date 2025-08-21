#!/bin/bash

# 🎨 Script para desenvolvimento do frontend
# Uso: ./scripts/dev-frontend.sh

set -e

echo "🎨 Iniciando desenvolvimento do frontend..."

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Execute este script do diretório front/"
    exit 1
fi

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    pnpm install
fi

# Iniciar servidor de desenvolvimento
echo "🚀 Iniciando servidor de desenvolvimento..."
echo "🌐 Frontend disponível em: http://localhost:5173"
echo "📋 Pressione Ctrl+C para parar"
echo ""

npm run dev
