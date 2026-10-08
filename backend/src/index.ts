// src/index.ts
import dotenv from 'dotenv';
dotenv.config();  // Carga las variables de entorno del archivo .env
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ping } from './db';

import inventoryRoutes from './routes/inventory';
import locationsRoutes from './routes/locations';
import movementsRoutes from './routes/movements';
import vehiclesRoutes from './routes/vehicles';
import maintenanceRoutes from './routes/maintenance';
import usersRoutes from "./routes/users";
import authRoutes from './routes/auth';
import nhtsaRoutes from './routes/nhtsa';


const app = express();

app.use(cors({ origin: true })); // en local: permite cualquier origen
app.use(express.json());


// Healthcheck
app.get('/api/health', async (_req, res) => {
  try {
    await ping();
    res.json({ ok: true, db: 'up' });
  } catch (err) {
    console.error('Healthcheck database connection failed:', err);
    res.status(500).json({ ok: false, db: 'down' });
  }
});

// Rutas API
app.use('/api/inventory', inventoryRoutes);
app.use('/api/locations', locationsRoutes);
app.use('/api/movements', movementsRoutes);
app.use('/api/vehicles', vehiclesRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/nhtsa', nhtsaRoutes);
// Manejo de errores simple
app.use((err: any, _req: express.Request, res: express.Response, _next: any) => {
  console.error(err);
  res.status(500).json({ error: 'internal_error', detail: err?.message ?? String(err) });
});

const PORT = Number(process.env.PORT || 5174);
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en el puerto: ${PORT}`);
});