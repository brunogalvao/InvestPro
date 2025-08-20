FROM node:18-alpine

WORKDIR /app

# Instalar curl para health check
RUN apk add --no-cache curl

# Instalar dependências
COPY package*.json ./
RUN npm ci --only=production

# Copiar código da aplicação
COPY . .

# Expor porta
EXPOSE 3000

# Comando para iniciar
CMD ["npm", "start"]
