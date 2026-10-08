FROM node:24-alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci
COPY . .

RUN npm run build

EXPOSE 5174
CMD ["npm", "start"]
