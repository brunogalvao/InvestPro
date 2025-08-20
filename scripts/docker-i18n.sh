#!/bin/bash

# Script para gerenciar o Docker i18n do InvestPro

echo "🐳 InvestPro i18n Docker Manager"
echo "=================================="

case "$1" in
  "start")
    echo "🚀 Iniciando serviços..."
    docker-compose up -d
    echo "✅ Serviços iniciados!"
    echo "📚 API i18n: http://localhost:3000"
    echo "🔴 Redis: localhost:6379"
    echo "🌐 Frontend: http://localhost:5173"
    ;;
    
  "stop")
    echo "🛑 Parando serviços..."
    docker-compose down
    echo "✅ Serviços parados!"
    ;;
    
  "restart")
    echo "🔄 Reiniciando serviços..."
    docker-compose restart
    echo "✅ Serviços reiniciados!"
    ;;
    
  "logs")
    echo "📋 Mostrando logs..."
    docker-compose logs -f
    ;;
    
  "build")
    echo "🔨 Construindo imagens..."
    docker-compose build --no-cache
    echo "✅ Imagens construídas!"
    ;;
    
  "clean")
    echo "🧹 Limpando containers e volumes..."
    docker-compose down -v
    docker system prune -f
    echo "✅ Limpeza concluída!"
    ;;
    
  "status")
    echo "📊 Status dos serviços..."
    docker-compose ps
    ;;
    
  "test")
    echo "🧪 Testando API..."
    curl -s http://localhost:3000/health | jq .
    ;;
    
  *)
    echo "Uso: $0 {start|stop|restart|logs|build|clean|status|test}"
    echo ""
    echo "Comandos disponíveis:"
    echo "  start   - Iniciar todos os serviços"
    echo "  stop    - Parar todos os serviços"
    echo "  restart - Reiniciar todos os serviços"
    echo "  logs    - Mostrar logs em tempo real"
    echo "  build   - Construir imagens Docker"
    echo "  clean   - Limpar containers e volumes"
    echo "  status  - Mostrar status dos serviços"
    echo "  test    - Testar API de traduções"
    exit 1
    ;;
esac
