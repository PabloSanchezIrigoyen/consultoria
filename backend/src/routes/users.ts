// src/routes/users.ts
import { Router, Request, Response, NextFunction } from 'express';
import { pool } from '../db';
import bcrypt from 'bcryptjs';

const router = Router();
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

/** GET /api/users  → lista de usuarios (sin exponer hash) */
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [rows] = await pool.query(
      `SELECT id,
              nombre,
              apellido,
              email,
              rol       AS role,
              activo    AS isActive
       FROM usuarios
       WHERE email <> 'Administrador@brunandfer.com'
       ORDER BY nombre, apellido`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/** POST /api/users  → crear usuario (con hash seguro) */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nombre, apellido, email, password, role } = req.body || {};
    if (!nombre || !apellido || !email || !password) {
      return res.status(400).json({ error: 'nombre, apellido, email y password son requeridos' });
    }

    const finalRole = role === 'admin' ? 'admin' : 'user';

    // Email único
    const [dups] = await pool.query(
      'SELECT id FROM usuarios WHERE email = :email LIMIT 1',
      { email }
    );
    if ((dups as any[]).length > 0) {
      return res.status(409).json({ error: 'email_ya_registrado' });
    }

    // Hash seguro
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    await pool.query(
      `INSERT INTO usuarios (nombre, apellido, email, password_hash, rol, activo)
       VALUES (:nombre, :apellido, :email, :password_hash, :rol, 1)`,
      { nombre, apellido, email, password_hash, rol: finalRole }
    );

    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

/** DELETE /api/users/:id  → eliminar usuario */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'id inválido' });

    await pool.query('DELETE FROM usuarios WHERE id = :id', { id });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
