#!/bin/bash

# 🚀 Script para iniciar o servidor de documentação
# Uso: ./start-docs.sh

set -e

echo "🚀 Iniciando servidor de documentação..."

# Verificar se estamos no diretório correto
if [ ! -f "docs-server.js" ]; then
    echo "❌ Execute este script do diretório back/"
    exit 1
fi

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

# Verificar se a porta 4001 está livre
if lsof -Pi :4001 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Porta 4001 já está em uso. Parando processo anterior..."
    pkill -f "docs-server.js" || true
    sleep 2
fi

# Iniciar servidor de documentação
echo "🌐 Iniciando servidor na porta 4001..."
node docs-server.js &

# Aguardar servidor inicializar
sleep 3

# Verificar se está funcionando
if curl -s http://localhost:4001 > /dev/null 2>&1; then
    echo ""
    echo "✅ Servidor de documentação iniciado com sucesso!"
    echo ""
    echo "🌐 URLs disponíveis:"
    echo "  📖 Menu Principal: http://localhost:4001"
    echo "  🔐 Account API Swagger: http://localhost:4001/docs/account"
    echo "  🌍 i18n API Swagger: http://localhost:4001/docs/i18n"
    echo "  📚 Documentação Estática: http://localhost:4001/docs/static"
    echo ""
    echo "🛑 Para parar o servidor: pkill -f 'docs-server.js'"
    echo ""
    echo "⏳ Pressione Ctrl+C para parar..."
    
    # Manter script rodando
    wait
else
    echo "❌ Erro ao iniciar servidor de documentação"
    exit 1
fi
