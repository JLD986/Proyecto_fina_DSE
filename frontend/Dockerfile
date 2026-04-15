# --- ETAPA 1: Construcción (Node.js) ---
FROM node:20-alpine AS build

WORKDIR /app

# Copiamos solo los archivos de configuración primero para aprovechar la caché de Docker
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código y compilamos
COPY . .
RUN npm run build -- --configuration production

# --- ETAPA 2: Ejecución (Nginx) ---
FROM nginx:stable-alpine

# Borramos los archivos por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiamos los archivos compilados desde la etapa anterior
# IMPORTANTE: Ajustamos la ruta al nuevo estándar de Angular 19
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Exponemos el puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
