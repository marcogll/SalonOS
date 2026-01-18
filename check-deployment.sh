#!/bin/bash

# Pre-deployment checks para AnchorOS

echo "🔍 Verificando pre-requisitos de deployment..."

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado"
    exit 1
fi

# Verificar Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado"
    exit 1
fi

# Verificar archivos necesarios
required_files=(".env" "package.json" "docker-compose.prod.yml" "Dockerfile")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Archivo faltante: $file"
        exit 1
    fi
done

# Verificar variables de entorno críticas
required_vars=("NEXT_PUBLIC_SUPABASE_URL" "NEXT_PUBLIC_SUPABASE_ANON_KEY" "SUPABASE_SERVICE_ROLE_KEY" "RESEND_API_KEY")
for var in "${required_vars[@]}"; do
    if ! grep -q "^$var=" .env; then
        echo "❌ Variable faltante en .env: $var"
        exit 1
    fi
done

# Verificar conectividad de red
echo "🌐 Verificando conectividad..."
if ! curl -s --max-time 5 https://supabase.co > /dev/null; then
    echo "⚠️  Posible problema de conectividad a internet"
fi

# Verificar puertos libres
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null; then
    echo "⚠️  Puerto 3000 ya está en uso"
fi

if lsof -Pi :80 -sTCP:LISTEN -t >/dev/null; then
    echo "⚠️  Puerto 80 ya está en uso"
fi

if lsof -Pi :443 -sTCP:LISTEN -t >/dev/null; then
    echo "⚠️  Puerto 443 ya está en uso"
fi

# Verificar espacio en disco
available_space=$(df / | tail -1 | awk '{print $4}')
if [ "$available_space" -lt 1000000 ]; then  # 1GB en KB
    echo "⚠️  Espacio en disco bajo: $(df -h / | tail -1 | awk '{print $4}') disponible"
fi

echo "✅ Pre-requisitos verificados correctamente"
echo "🚀 Listo para deployment"