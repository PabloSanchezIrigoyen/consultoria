# 📖 Manual de Instalación — App Constructora

Este documento describe los pasos necesarios para instalar y ejecutar el sistema **App Constructora** en un entorno local o con contenedores Docker.

---

## 🔧 Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) v24 o superior
- npm (incluido con Node.js)
- [PostgreSQL](https://www.postgresql.org/) (si deseas correr la base de datos localmente)
- [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/) (opcional, para ejecución en contenedores)
- Git

---

## ▶️ Instalación local

### 1. Clonar el repositorio
```bash
git clone https://github.com/edgar0935/app-constructora.git
cd app-constructora

2. Instalar dependencias
```bash
npm --prefix backend ci
npm --prefix inventario-constructora ci
```

3. Configurar la base de datos
El archivo `db/constructora_app.sql` crea la estructura y los datos iniciales
para PostgreSQL. Con Docker Compose, se importa automáticamente en una base
local llamada `constructora_app`.

Configura `DATABASE_URL` en `backend/.env` con la cadena de conexión de
PostgreSQL, por ejemplo `postgresql://postgres:tu_password@localhost:5432/constructora_app`.
JWT_SECRET=tu_clave_segura

4. Ejecutar el backend
cd backend
npm run build
npm start
El backend quedará disponible en http://localhost:5174.

5. Ejecutar el frontend
cd inventario-constructora
npm run dev
El frontend quedará disponible en http://localhost:5173.

🐳 Instalación con Docker
1. Levantar servicios
En la raíz del proyecto:
docker-compose up --build

Esto levantará:

PostgreSQL en localhost:5432

Backend en http://localhost:5174

Frontend en http://localhost:5173

2. Variables de entorno
Configura las variables en docker-compose.yml o en archivos .env según sea necesario.