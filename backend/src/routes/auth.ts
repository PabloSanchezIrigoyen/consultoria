// src/routes/auth.ts

import { Router } from "express";
import { pool } from "../db";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "8h";

/** POST /api/auth/login  { email, password } */
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "missing_fields" });
    }

    // Ahora apunta a la tabla `usuarios` y columnas `rol`, `activo`
    const { rows } = await pool.query(
      `SELECT
         id,
         nombre,
         apellido,
         email,
         password_hash,
         rol    AS role,
         activo AS is_active
       FROM usuarios
       WHERE email = $1
       LIMIT 1`,
      [email]
    );

    const u = rows[0];
    if (!u) return res.status(401).json({ error: "invalid_credentials" });
    if (!u.is_active) return res.status(403).json({ error: "inactive_user" });

    if (typeof u.password_hash !== "string" || !u.password_hash.startsWith("$2")) {
      // No debería ocurrir: todo usuario debe tener su contraseña hasheada con bcrypt.
      console.error(`LOGIN: usuario ${u.email} sin password_hash bcrypt válido`);
      return res.status(401).json({ error: "invalid_credentials" });
    }

    const ok = await bcrypt.compare(password, u.password_hash);
    if (!ok) return res.status(401).json({ error: "invalid_credentials" });

    const user = {
      id: u.id,
      name: `${u.nombre ?? ""} ${u.apellido ?? ""}`.trim() || u.email,
      email: u.email,
      role: u.role ?? "user",
    };

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET as string,
      { expiresIn: JWT_EXPIRES_IN } as SignOptions
    );

    res.json({ ok: true, user, token });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    next(err);
  }
});

export default router;