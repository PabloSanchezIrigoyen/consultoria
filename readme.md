# App Constructora

Sistema integral de inventario y gestión de vehículos para constructora Brun&Fer.  
Incluye **backend (Node.js/Express/TypeScript)**, **frontend (React/Vite)**, **base de datos (PostgreSQL/Supabase)** y **CI/CD con GitHub Actions**.

---

## 🚀 Tecnologías principales
- **Backend:** Node.js, Express, TypeScript, npm
- **Frontend:** React + Vite
- **Base de datos:** PostgreSQL
- **Contenedores:** Docker + Docker Compose
- **CI/CD:** GitHub Actions

---

## 📂 Estructura del proyecto
app-constructora/
├── backend/                 # API REST con Express
├── inventario-constructora/ # Frontend React + Vite
├── db/                      # Scripts SQL y documentación de la base de datos
├── docs/                    # Manuales y diagramas
└── .github/workflows/ci.yml # Pipeline CI/CD




---

## ▶️ Instalación local

### 1. Clonar el repositorio
```bash
git clone https://github.com/edgar0935/app-constructora.git
cd app-constructora

Instalar las dependencias del backend y frontend:
```bash
npm --prefix backend ci
npm --prefix inventario-constructora ci
```


3. Ejecutar backend
cd backend
npm run build
npm start

4. Ejecutar frontend
cd inventario-constructora
npm run dev

🐳 Ejecución con Docker
En la raíz del proyecto:
docker-compose up --build

Esto levantará:

PostgreSQL en localhost:5432

Backend en http://localhost:5174

Frontend en http://localhost:5173


🔐 Autenticación
El backend usa JWT para proteger rutas privadas.
Configura tu .env con:
JWT_SECRET=tu_clave_segura

## Despliegue en Render

El backend está dentro de `backend/`; el `package.json` de la raíz delega los
comandos a esa carpeta para que Render pueda construir desde la raíz del
repositorio sin buscar `src/index.ts` en una ruta incorrecta.

Configura el servicio web de Render con:

- **Root Directory:** vacío (raíz del repositorio)
- **Build Command:** `npm run build`
- **Start Command:** `npm start`

Define `DATABASE_URL` con la cadena de conexión PostgreSQL de Supabase y
`JWT_SECRET` con una cadena larga y aleatoria. Usa la cadena PostgreSQL de
Supabase con SSL habilitado.

El frontend es un servicio independiente de tipo **Static Site**:

- **Root Directory:** `inventario-constructora`
- **Build Command:** `npm ci && npm run build`
- **Publish Directory:** `dist`
- **Environment Variable:** `VITE_API_URL=https://<URL-publica-del-backend>`
- **Rewrite:** `/*` a `/index.html` para que funcionen las rutas de React Router.

En el servicio web del backend permite solicitudes CORS desde el dominio
publicado del frontend si restringes los orígenes permitidos.
