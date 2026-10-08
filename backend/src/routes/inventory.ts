// src/routes/inventory.ts
import { Router } from "express";
import { pool } from "../db";
import { auth, AuthedRequest } from "../middleware/auth";

const router = Router();

/** Util: registra un movimiento en la tabla movimientos */
async function logMovement(opts: {
  type: "create" | "update" | "delete";
  entity: string;
  entityId?: string | number | null;
  entityName?: string | null;
  description: string;
  ts?: Date;
  actor?: { name?: string | null; email?: string | null; role?: string | null };
}) {
  const { type, entity, entityId, entityName, description, ts, actor } = opts;
  await pool.query(
    `INSERT INTO movimientos
       (tipo, entidad, entidad_id, nombre_entidad, descripcion, fecha_hora,
        nombre_actor, correo_actor, rol_actor)
     VALUES
       ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      type,
      entity,
      entityId ?? null,
      entityName ?? null,
      description,
      ts ?? new Date(),
      actor?.name ?? null,
      actor?.email ?? null,
      actor?.role ?? null,
    ]
  );
}

/** Util: resuelve el id de una ubicación por nombre (o null si vacío/no existe) */
async function resolveLocationId(name?: string | null): Promise<number | null> {
  const n = (name ?? "").toString().trim();
  if (!n) return null;
  const { rows } = await pool.query(
    "SELECT id FROM ubicaciones WHERE nombre = $1 LIMIT 1",
    [n]
  );
  const r = rows[0];
  return r ? Number(r.id) : null;
}

/** GET /api/inventory → lista con nombre de ubicación (pública) */
router.get("/", async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT i.id,
              i.nombre,
              i.cantidad,
              l.nombre AS ubicacion
       FROM inventario i
       LEFT JOIN ubicaciones l ON l.id = i.ubicacion_id
       ORDER BY i.id ASC`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/** POST /api/inventory → crear (protegida) */
router.post("/", auth, async (req: AuthedRequest, res, next) => {
  try {
    const { id, nombre, cantidad, ubicacion } = req.body || {};
    if (!nombre) return res.status(400).json({ error: "nombre requerido" });

    const locId = await resolveLocationId(ubicacion);
    const createdBy = req.user?.id ?? null;

    let createdId = id ? Number(id) : null;

    if (createdId != null) {
      const { rows } = await pool.query(
        `INSERT INTO inventario (id, nombre, cantidad, ubicacion_id, created_by)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO UPDATE SET
           nombre = EXCLUDED.nombre,
           cantidad = EXCLUDED.cantidad,
           ubicacion_id = EXCLUDED.ubicacion_id
         RETURNING id`,
        [createdId, String(nombre), Number(cantidad ?? 0), locId, createdBy]
      );
      createdId = Number(rows[0].id);
    } else {
      const { rows } = await pool.query(
        `INSERT INTO inventario (nombre, cantidad, ubicacion_id, created_by)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [String(nombre), Number(cantidad ?? 0), locId, createdBy]
      );
      createdId = Number(rows[0].id);
    }

    await logMovement({
      type: "create",
      entity: "articulo",
      entityId: createdId!,
      entityName: String(nombre),
      description: `Agregó artículo “${String(nombre)}” (id ${createdId})`,
      actor: {
        name: req.user?.name ?? null,
        email: req.user?.email ?? null,
        role: req.user?.role ?? null,
      },
    });

    res.status(201).json({ ok: true, id: createdId });
  } catch (err: any) {
    if (err?.code === "23505") {
      return res.status(409).json({ error: "articulo_duplicado_misma_ubicacion" });
    }
    next(err);
  }
});

/** PUT /api/inventory/:id → actualizar (protegida) */
router.put("/:id", auth, async (req: AuthedRequest, res, next) => {
  try {
    const id = Number(req.params.id);
    const { nombre, cantidad, ubicacion } = req.body || {};
    if (!Number.isFinite(id)) return res.status(400).json({ error: "id inválido" });
    if (!nombre) return res.status(400).json({ error: "nombre requerido" });

    const { rows: prevRows } = await pool.query(
      `SELECT i.id, i.nombre, i.cantidad, l.nombre AS ubicacion
       FROM inventario i
       LEFT JOIN ubicaciones l ON l.id = i.ubicacion_id
       WHERE i.id = $1 LIMIT 1`,
      [id]
    );
    const prev = prevRows[0];

    const locId = await resolveLocationId(ubicacion);

    const r = await pool.query(
      `UPDATE inventario
       SET nombre = $1,
           cantidad = $2,
           ubicacion_id = $3
       WHERE id = $4`,
      [String(nombre), Number(cantidad ?? 0), locId, id]
    );

    if (prev) {
      const descPartNombre = prev.nombre !== String(nombre)
        ? `nombre “${prev.nombre}” → “${String(nombre)}”, `
        : "";
      const descPartCant = Number(prev.cantidad) !== Number(cantidad ?? 0)
        ? `cantidad ${prev.cantidad} → ${Number(cantidad ?? 0)}, `
        : "";
      const prevUb = (prev.ubicacion || "Sin asignar").toString();
      const newUb = ((ubicacion ?? "").toString().trim() || "Sin asignar");
      const descPartUb = prevUb !== newUb
        ? `ubicación “${prevUb}” → “${newUb}”`
        : "";
      const pieces = `${descPartNombre}${descPartCant}${descPartUb}`.replace(/, +$/, "");
      const description = pieces
        ? `Actualizó “${prev.nombre}”: ${pieces}`
        : `Actualizó “${prev.nombre}”`;

      await logMovement({
        type: "update",
        entity: "articulo",
        entityId: id,
        entityName: String(nombre),
        description,
        actor: {
          name: req.user?.name ?? null,
          email: req.user?.email ?? null,
          role: req.user?.role ?? null,
        },
      });
    }

    res.json({ ok: true, affected: r.rowCount ?? 0 });
  } catch (err: any) {
    if (err?.code === "23505") {
      return res.status(409).json({ error: "articulo_duplicado_misma_ubicacion" });
    }
    next(err);
  }
});

/** DELETE /api/inventory/:id (protegida) */
router.delete("/:id", auth, async (req: AuthedRequest, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "id inválido" });

    const { rows: prevRows } = await pool.query(
      `SELECT i.id, i.nombre FROM inventario i WHERE i.id = $1 LIMIT 1`,
      [id]
    );
    const prev = prevRows[0];

    const r = await pool.query(
      "DELETE FROM inventario WHERE id = $1",
      [id]
    );

    if ((r.rowCount ?? 0) > 0 && prev) {
      await logMovement({
        type: "delete",
        entity: "articulo",
        entityId: id,
        entityName: prev.nombre,
        description: `Eliminó artículo “${prev.nombre}”`,
        actor: {
          name: req.user?.name ?? null,
          email: req.user?.email ?? null,
          role: req.user?.role ?? null,
        },
      });
    }

    res.json({ ok: true, affected: r.rowCount ?? 0 });
  } catch (err) {
    next(err);
  }
});

export default router;
