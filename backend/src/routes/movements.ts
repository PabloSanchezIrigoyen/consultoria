// src/routes/movements.ts
import { Router } from "express";
import { pool } from "../db";
import { auth, AuthedRequest } from "../middleware/auth";

const router = Router();

/** GET /api/movements?limit=100&offset=0 */
router.get("/", auth, async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(parseInt(String(req.query.limit ?? "100")), 1), 500);
    const offset = Math.max(parseInt(String(req.query.offset ?? "0")), 0);

    const [rows] = await pool.query(
      `SELECT id,
              tipo            AS type,
              entidad         AS entity,
              entidad_id      AS entity_id,
              nombre_entidad  AS entity_name,
              descripcion     AS description,
              fecha_hora      AS ts,
              nombre_actor    AS actor_name,
              correo_actor    AS actor_email,
              rol_actor       AS actor_role
         FROM movimientos
        ORDER BY fecha_hora DESC
        LIMIT :limit OFFSET :offset`,
      { limit, offset }
    );

    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/** POST /api/movements */
router.post("/", auth, async (req: AuthedRequest, res, next) => {
  try {
    const {
      type,
      entity,
      entityId = null,
      entityName = null,
      description = "",
      timestamp,
    } = req.body || {};

    const allowed = new Set(["create", "update", "delete"]);
    if (!type || !allowed.has(String(type))) {
      return res.status(400).json({ error: "invalid_type" });
    }
    if (!entity) {
      return res.status(400).json({ error: "missing_fields" });
    }

    let ts = new Date();
    if (timestamp) {
      const maybe = new Date(timestamp);
      if (!isNaN(+maybe)) ts = maybe;
    }

    await pool.query(
      `INSERT INTO movimientos
        (tipo, entidad, entidad_id, nombre_entidad, descripcion, fecha_hora,
         nombre_actor, correo_actor, rol_actor)
       VALUES
        (:tipo, :entidad, :entidad_id, :nombre_entidad, :descripcion, :fecha_hora,
         :nombre_actor, :correo_actor, :rol_actor)`,
      {
        tipo: String(type),
        entidad: String(entity),
        entidad_id: entityId,
        nombre_entidad: entityName,
        descripcion: String(description ?? ""),
        fecha_hora: ts,
        nombre_actor: req.user?.name ?? null,
        correo_actor: req.user?.email ?? null,
        rol_actor: req.user?.role ?? null,
      }
    );

    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
