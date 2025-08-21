#!/bin/bash

# 🐳 Script para iniciar ambiente de desenvolvimento do InvestPro
# Uso: ./scripts/start-dev.sh

set -e

echo "🚀 Iniciando ambiente de desenvolvimento..."

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Inicie o Docker e tente novamente."
    exit 1
fi

# Verificar se docker-compose está disponível
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose não está instalado. Instale e tente novamente."
    exit 1
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down

# Build dos containers (se necessário)
echo "📦 Verificando se containers precisam de build..."
docker-compose build

# Iniciar serviços
echo "🚀 Iniciando serviços..."
docker-compose up -d

# Aguardar serviços ficarem saudáveis
echo "⏳ Aguardando serviços ficarem saudáveis..."
sleep 15

# Verificar status dos serviços
echo "📊 Status dos serviços:"
docker-compose ps

echo ""
echo "✅ Ambiente de desenvolvimento iniciado!"
echo ""
echo "🌐 URLs disponíveis:"
echo "  - Frontend: http://localhost:5173"
echo "  - API de Contas: http://localhost:4000"
echo "  - API de Traduções: http://localhost:3000"
echo "  - PostgreSQL: localhost:5432"
echo "  - Redis: localhost:6379"
echo ""
echo "📋 Comandos úteis:"
echo "  - Ver logs: docker-compose logs -f"
echo "  - Ver logs de um serviço: docker-compose logs -f [serviço]"
echo "  - Parar: docker-compose down"
echo "  - Rebuild: docker-compose build"
echo "  - Rebuild e reiniciar: docker-compose up -d --build"
echo ""
echo "🔧 Para desenvolvimento:"
echo "  - Frontend: cd front && npm run dev"
echo "  - Account API: cd back/account-api && npm run dev"
echo "  - i18n API: cd back/i18n-api && npm run dev"
