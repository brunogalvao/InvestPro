#!/bin/bash

# 🚀 Script de Deploy para Produção - InvestPro
# Uso: ./docker/scripts/deploy-prod.sh [--force]

set -e

echo "🚀 Iniciando deploy de produção..."

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

# Verificar se arquivo de ambiente existe
if [[ ! -f ".env.prod" ]]; then
    echo "❌ Arquivo .env.prod não encontrado!"
    echo "📋 Crie o arquivo .env.prod baseado em docker/configs/env.example"
    exit 1
fi

# Argumentos
FORCE=false
if [[ "$1" == "--force" ]]; then
    FORCE=true
    echo "🔧 Deploy forçado ativado"
fi

# Confirmação de deploy
if [[ "$FORCE" != true ]]; then
    echo ""
    echo "⚠️  ATENÇÃO: Este é um deploy de PRODUÇÃO!"
    echo "📋 Verifique se:"
    echo "  - Todas as variáveis de ambiente estão configuradas"
    echo "  - O banco de dados está configurado"
    echo "  - As senhas são seguras"
    echo ""
    read -p "🤔 Continuar com o deploy? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Deploy cancelado pelo usuário"
        exit 1
    fi
fi

# Backup dos dados existentes (se houver)
if docker volume ls | grep -q "investpro_postgres_data"; then
    echo "💾 Criando backup do banco de dados..."
    docker run --rm -v investpro_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup_$(date +%Y%m%d_%H%M%S).tar.gz -C /data .
fi

# Parar serviços existentes
echo "🛑 Parando serviços existentes..."
docker-compose -f docker-compose.prod.yml --env-file .env.prod down

# Build dos containers
echo "📦 Build dos containers..."
./docker/scripts/build-all.sh --no-cache

# Iniciar serviços de produção
echo "🚀 Iniciando serviços de produção..."
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d

# Aguardar serviços ficarem saudáveis
echo "⏳ Aguardando serviços ficarem saudáveis..."
sleep 15

# Verificar status dos serviços
echo "📊 Status dos serviços:"
docker-compose -f docker-compose.prod.yml --env-file .env.prod ps

# Verificar health checks
echo "🏥 Verificando health checks..."
echo "  - PostgreSQL: $(docker-compose -f docker-compose.prod.yml --env-file .env.prod exec -T postgres pg_isready -U ${POSTGRES_USER:-investpro} -d ${POSTGRES_DB:-investpro} 2>/dev/null && echo "✅" || echo "❌")"
echo "  - Redis: $(docker-compose -f docker-compose.prod.yml --env-file .env.prod exec -T redis redis-cli ping 2>/dev/null | grep -q "PONG" && echo "✅" || echo "❌")"
echo "  - i18n API: $(curl -s http://localhost:3000/health >/dev/null && echo "✅" || echo "❌")"
echo "  - Account API: $(curl -s http://localhost:4000/health >/dev/null && echo "✅" || echo "❌")"

echo ""
echo "✅ Deploy de produção concluído!"
echo ""
echo "🌐 URLs disponíveis:"
echo "  - API de Contas: http://localhost:4000"
echo "  - API de Traduções: http://localhost:3000"
echo "  - PostgreSQL: localhost:5432"
echo "  - Redis: localhost:6379"
echo ""
echo "📋 Comandos úteis:"
echo "  - Ver logs: docker-compose -f docker-compose.prod.yml --env-file .env.prod logs -f"
echo "  - Parar: docker-compose -f docker-compose.prod.yml --env-file .env.prod down"
echo "  - Status: docker-compose -f docker-compose.prod.yml --env-file .env.prod ps"
echo ""
echo "🔒 Lembre-se de:"
echo "  - Configurar firewall"
echo "  - Configurar SSL/HTTPS"
echo "  - Configurar monitoramento"
echo "  - Configurar backups automáticos"
