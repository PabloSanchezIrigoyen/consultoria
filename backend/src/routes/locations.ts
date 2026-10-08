// src/routes/locations.ts
import { Router } from "express";
import { pool } from "../db";
import { auth, AuthedRequest } from "../middleware/auth";
import { logMovement } from "../utils/logMovement";

const router = Router();

/** GET /api/locations */
router.get("/", async (_req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT nombre FROM ubicaciones ORDER BY nombre ASC");
    res.json(rows.map(r => r.nombre));
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

    const { rows } = await pool.query(
      "INSERT INTO ubicaciones (nombre, created_by) VALUES ($1, $2) RETURNING id",
      [clean, req.user?.id ?? null]
    );
    const id = rows[0].id as number;

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
    if (err?.code === "23505")
      return res.status(409).json({ error: "ubicación ya existe" });
    next(err);
  }
});

/** DELETE /api/locations/by-name/:name */
router.delete("/by-name/:name", auth, async (req: AuthedRequest, res, next) => {
  try {
    const name = decodeURIComponent(req.params.name ?? "").trim();
    if (!name) return res.status(400).json({ error: "nombre requerido" });

    const { rows: found } = await pool.query(
      "SELECT id FROM ubicaciones WHERE nombre = $1 LIMIT 1",
      [name]
    );
    const row = found[0];
    const id = row?.id ?? null;

    const r = await pool.query(
      "DELETE FROM ubicaciones WHERE nombre = $1",
      [name]
    );
    const affected = r.rowCount ?? 0;

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
    if (err?.code === "23503")
      return res.status(409).json({ error: "ubicacion_en_uso" });
    next(err);
  }
});

export default router;
