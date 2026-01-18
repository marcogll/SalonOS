#!/bin/bash

# AnchorOS Deployment Script para VPS
# Uso: ./deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
PROJECT_NAME="anchoros"

echo "🚀 Iniciando deployment de AnchorOS ($ENVIRONMENT)"

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Ejecutar desde el directorio raíz del proyecto"
    exit 1
fi

# Verificar variables de entorno
if [ ! -f ".env" ]; then
    echo "❌ Error: Archivo .env no encontrado. Copia .env.example a .env y configura las variables"
    exit 1
fi

echo "📦 Construyendo imagen Docker..."
docker build -t $PROJECT_NAME:$ENVIRONMENT .

echo "🐳 Deteniendo contenedores existentes..."
docker-compose -f docker-compose.prod.yml down || true

echo "🧹 Limpiando imágenes no utilizadas..."
docker image prune -f

echo "🚀 Iniciando servicios..."
docker-compose -f docker-compose.prod.yml up -d

echo "⏳ Esperando que los servicios estén listos..."
sleep 30

echo "🔍 Verificando health check..."
if curl -f http://localhost/health > /dev/null 2>&1; then
    echo "✅ Deployment exitoso!"
    echo "🌐 App disponible en: http://tu-dominio.com"
    echo "📊 Monitorea logs con: docker-compose -f docker-compose.prod.yml logs -f"
else
    echo "❌ Error: Health check falló"
    echo "📋 Revisa logs: docker-compose -f docker-compose.prod.yml logs"
    exit 1
fi

echo "🧹 Limpiando builds antiguos..."
docker image prune -f