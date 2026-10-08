# Imagen base oficial de Node
FROM node:18

# Directorio de trabajo
WORKDIR /app

# Copiamos package.json y pnpm-lock.yaml
COPY package.json pnpm-lock.yaml* ./

# Instalamos pnpm
RUN npm install -g pnpm

# Instalamos dependencias
RUN pnpm install

# Copiamos el resto del código
COPY . .

# Compilamos TypeScript
RUN pnpm build

# Exponemos el puerto
EXPOSE 5174

# Comando de inicio
CMD ["pnpm", "start"]
