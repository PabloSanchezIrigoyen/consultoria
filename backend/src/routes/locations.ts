// src/routes/locations.ts
import { Router } from "express";
import { pool } from "../db";
import { auth, AuthedRequest } from "../middleware/auth";
import { logMovement } from "../utils/logMovement";

const router = Router();

/** GET /api/locations */
router.get("/", async (_req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT nombre FROM ubicaciones ORDER BY nombre ASC");
    res.json((rows as any[]).map(r => r.nombre));
  } catch (err) {
    next(err);
  }
});

/** POST /api/locations */
router.post("/", auth, async (req: AuthedRequest, res, next) => {
  try {
    const { name } = req.body || {};
    const clean = String(name || "").trim();
    if (!clean) return res.status(400).json({ error: "nombre requerido" });

    const [result] = await pool.query(
      "INSERT INTO ubicaciones (nombre, created_by) VALUES (:nombre, :created_by)",
      { nombre: clean, created_by: req.user?.id ?? null }
    );
    const id = (result as any).insertId as number;

    await logMovement(pool, {
      type: "create",
      entity: "ubicacion",
      entityId: id,
      entityName: clean,
      description: `Creó ubicación “${clean}”`,
      actor: req.user,
    });

    res.status(201).json({ ok: true, id });
  } catch (err: any) {
    if (err?.code === "ER_DUP_ENTRY")
      return res.status(409).json({ error: "ubicación ya existe" });
    next(err);
  }
});

/** DELETE /api/locations/by-name/:name */
router.delete("/by-name/:name", auth, async (req: AuthedRequest, res, next) => {
  try {
    const name = decodeURIComponent(req.params.name ?? "").trim();
    if (!name) return res.status(400).json({ error: "nombre requerido" });

    const [found] = await pool.query(
      "SELECT id FROM ubicaciones WHERE nombre = :nombre LIMIT 1",
      { nombre: name }
    );
    const row = (found as any[])[0];
    const id = row?.id ?? null;

    const [r] = await pool.query(
      "DELETE FROM ubicaciones WHERE nombre = :nombre",
      { nombre: name }
    );
    const affected = (r as any).affectedRows ?? 0;

    if (affected > 0) {
      await logMovement(pool, {
        type: "delete",
        entity: "ubicacion",
        entityId: id,
        entityName: name,
        description: `Eliminó ubicación “${name}”`,
        actor: req.user,
      });
    }

    res.json({ ok: true, affected });
  } catch (err: any) {
    if (err?.code === "ER_ROW_IS_REFERENCED_2")
      return res.status(409).json({ error: "ubicacion_en_uso" });
    next(err);
  }
});

export default router;
