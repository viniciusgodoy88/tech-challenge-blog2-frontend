# Estágio 1: Build da aplicação React com Vite
FROM node:20-alpine AS builder

WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências do projeto
RUN npm ci

# Copia o restante do código-fonte
COPY . .

# Gera o build de produção na pasta /dist
RUN npm run build

# Estágio 2: Servidor Nginx para entregar os arquivos estáticos
FROM nginx:alpine

# Copia o build gerado no estágio anterior para a pasta pública do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia a configuração personalizada do Nginx para suportar React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80 do container
EXPOSE 80

# Inicia o servidor Nginx
CMD ["nginx", "-g", "daemon off;"]