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
       (:tipo, :entidad, :entidad_id, :nombre_entidad, :descripcion, :fecha_hora,
        :nombre_actor, :correo_actor, :rol_actor)`,
    {
      tipo: type,
      entidad: entity,
      entidad_id: entityId ?? null,
      nombre_entidad: entityName ?? null,
      descripcion: description,
      fecha_hora: ts ?? new Date(),
      nombre_actor: actor?.name ?? null,
      correo_actor: actor?.email ?? null,
      rol_actor: actor?.role ?? null,
    }
  );
}

/** Util: resuelve el id de una ubicación por nombre (o null si vacío/no existe) */
async function resolveLocationId(name?: string | null): Promise<number | null> {
  const n = (name ?? "").toString().trim();
  if (!n) return null;
  const [rows] = await pool.query(
    "SELECT id FROM ubicaciones WHERE nombre = :name LIMIT 1",
    { name: n }
  );
  const r = (rows as any[])[0];
  return r ? Number(r.id) : null;
}

/** GET /api/inventory → lista con nombre de ubicación (pública) */
router.get("/", async (_req, res, next) => {
  try {
    const [rows] = await pool.query(
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
      await pool.query(
        `INSERT INTO inventario (id, nombre, cantidad, ubicacion_id, created_by)
         VALUES (:id, :nombre, :cantidad, :ubicacion_id, :created_by)
         ON DUPLICATE KEY UPDATE
           nombre = VALUES(nombre),
           cantidad = VALUES(cantidad),
           ubicacion_id = VALUES(ubicacion_id)`,
        {
          id: createdId,
          nombre: String(nombre),
          cantidad: Number(cantidad ?? 0),
          ubicacion_id: locId,
          created_by: createdBy,
        }
      );
    } else {
      const [r] = await pool.query(
        `INSERT INTO inventario (nombre, cantidad, ubicacion_id, created_by)
         VALUES (:nombre, :cantidad, :ubicacion_id, :created_by)`,
        {
          nombre: String(nombre),
          cantidad: Number(cantidad ?? 0),
          ubicacion_id: locId,
          created_by: createdBy,
        }
      );
      createdId = (r as any).insertId as number;
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
    if (err?.code === "ER_DUP_ENTRY") {
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

    const [prevRows] = await pool.query(
      `SELECT i.id, i.nombre, i.cantidad, l.nombre AS ubicacion
       FROM inventario i
       LEFT JOIN ubicaciones l ON l.id = i.ubicacion_id
       WHERE i.id = :id LIMIT 1`,
      { id }
    );
    const prev = (prevRows as any[])[0];

    const locId = await resolveLocationId(ubicacion);

    const [r] = await pool.query(
      `UPDATE inventario
       SET nombre = :nombre,
           cantidad = :cantidad,
           ubicacion_id = :ubicacion_id
       WHERE id = :id`,
      {
        id,
        nombre: String(nombre),
        cantidad: Number(cantidad ?? 0),
        ubicacion_id: locId,
      }
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

    res.json({ ok: true, affected: (r as any).affectedRows ?? 0 });
  } catch (err: any) {
    if (err?.code === "ER_DUP_ENTRY") {
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

    const [prevRows] = await pool.query(
      `SELECT i.id, i.nombre FROM inventario i WHERE i.id = :id LIMIT 1`,
      { id }
    );
    const prev = (prevRows as any[])[0];

    const [r] = await pool.query(
      "DELETE FROM inventario WHERE id = :id",
      { id }
    );

    if ((r as any).affectedRows > 0 && prev) {
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

    res.json({ ok: true, affected: (r as any).affectedRows ?? 0 });
  } catch (err) {
    next(err);
  }
});

export default router;
