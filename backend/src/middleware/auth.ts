// src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export interface AuthedRequest extends Request {
  user?: { id: number; email: string; role: "admin" | "user"; name?: string };
}

export function auth(req: AuthedRequest, res: Response, next: NextFunction) {
  const h = req.header("Authorization") || "";
  const m = h.match(/^Bearer\s+(.+)$/i);
  if (!m) return res.status(401).json({ error: "Falta token" });

  try {
    const payload = jwt.verify(m[1], JWT_SECRET) as any;
    // payload recomendado: { id, email, role, name }
    req.user = { id: payload.id, email: payload.email, role: payload.role, name: payload.name };
    return next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
}

export function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== "admin") return res.status(403).json({ error: "Solo admin" });
  next();
}
