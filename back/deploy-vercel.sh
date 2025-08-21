#!/bin/bash

# 🚀 Script para deploy na Vercel
# Uso: ./deploy-vercel.sh

set -e

echo "🚀 Preparando deploy na Vercel..."

# Verificar se estamos no diretório correto
if [ ! -f "docs-server.js" ]; then
    echo "❌ Execute este script do diretório back/"
    exit 1
fi

# Verificar se o Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "📦 Instalando Vercel CLI..."
    npm install -g vercel
fi

# Verificar se está logado no Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Faça login no Vercel..."
    vercel login
fi

# Preparar arquivos para deploy
echo "📁 Preparando arquivos..."

# Copiar package.json específico
cp package-docs.json package.json

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

# Criar arquivo .vercelignore se não existir
if [ ! -f ".vercelignore" ]; then
    echo "📝 Criando .vercelignore..."
    cat > .vercelignore << EOF
# Ignorar arquivos desnecessários
node_modules/
*.log
.env
.env.local
.DS_Store
*.md
!README.md
scripts/
docker/
account-api/
i18n-api/
EOF
fi

# Deploy na Vercel
echo "🌐 Fazendo deploy na Vercel..."
echo "📋 Responda às perguntas do Vercel:"
echo "   - Project name: investpro-docs (ou deixe vazio para auto)"
echo "   - Directory: ./ (deixe vazio)"
echo "   - Override settings: No (deixe vazio)"

vercel --prod

# Restaurar package.json original
echo "🔄 Restaurando package.json original..."
git checkout package.json

echo ""
echo "🎉 Deploy concluído com sucesso!"
echo "🌐 Sua documentação está disponível na URL fornecida pelo Vercel"
echo ""
echo "📚 Para atualizar no futuro, execute:"
echo "   ./deploy-vercel.sh"
echo ""
echo "🔗 Ou use o comando: vercel --prod"
