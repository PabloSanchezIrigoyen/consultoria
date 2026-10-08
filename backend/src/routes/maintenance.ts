// backend/src/routes/maintenance.ts
import { Router } from "express";
import { pool } from "../db";
import { auth, AuthedRequest } from "../middleware/auth";
import { logMovement } from "../utils/logMovement";
import { randomUUID } from "crypto";

const router = Router();

/** GET /api/maintenance/:vehiculoId */
router.get("/:vehiculoId", async (req, res, next) => {
  try {
    const vehiculoId = Number(req.params.vehiculoId);
    if (!vehiculoId)
      return res.status(400).json({ error: "vehiculoId inválido" });

    const [rows] = await pool.query(
      `SELECT id,
              vehiculo_id AS vehiculoId,
              DATE_FORMAT(fecha, '%Y-%m-%d') AS fechaISO,
              servicio, kilometraje, lugar, importe, notas
       FROM mantenimientos
       WHERE vehiculo_id = :vehiculoId
       ORDER BY fecha DESC, id DESC`,
      { vehiculoId }
    );

    res.json(rows);
  } catch (e) {
    next(e);
  }
});

/** POST /api/maintenance */
router.post("/", auth, async (req: AuthedRequest, res, next) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const { vehiculoId, fechaISO, servicio, kilometraje, lugar, importe, notas } = req.body || {};

    if (!vehiculoId || !fechaISO || !servicio?.trim())
      return res.status(400).json({ error: "vehiculoId, fechaISO y servicio son requeridos" });

    const createdBy = req.user?.id;
    if (!createdBy)
      return res.status(401).json({ error: "usuario_no_autenticado" });

    // Verificar vehículo
    const [vehRows] = await conn.query(
      `SELECT id, nombre, placa, kilometraje
       FROM vehiculos
       WHERE id = :id
       LIMIT 1`,
      { id: Number(vehiculoId) }
    );
    const veh = (vehRows as any[])[0];
    if (!veh) return res.status(404).json({ error: "vehiculo_no_encontrado" });

    // Crear mantenimiento con UUID
    const mantenimientoId = randomUUID();

    await conn.query(
      `INSERT INTO mantenimientos
       (id, vehiculo_id, fecha, servicio, kilometraje, lugar, importe, notas, created_by)
       VALUES
       (:id, :vehiculoId, :fechaISO, :servicio, :kilometraje, :lugar, :importe, :notas, :created_by)`,
      {
        id: mantenimientoId,
        vehiculoId: Number(vehiculoId),
        fechaISO,
        servicio: String(servicio).trim(),
        kilometraje: Number(kilometraje ?? 0),
        lugar: (lugar ?? "").toString(),
        importe: Number(importe ?? 0),
        notas: (notas ?? "").toString(),
        created_by: createdBy,
      }
    );

    // Registrar movimiento de creación
    await logMovement(conn, {
      type: "create",
      entity: "mantenimiento",
      entityId: mantenimientoId,
      entityName: `${veh.nombre} - ${servicio}`,
      description: `Se registró el servicio de ${servicio} en el vehículo ${veh.nombre} con placa ${veh.placa}`,
      actor: req.user,
    });

    // Actualizar kilometraje si es mayor
    const kmNuevo = Number(kilometraje ?? 0);
    if (Number(veh.kilometraje) < kmNuevo) {
      await conn.query(`UPDATE vehiculos SET kilometraje = :km WHERE id = :id`, {
        km: kmNuevo,
        id: Number(vehiculoId),
      });

      await logMovement(conn, {
        type: "update",
        entity: "vehiculo",
        entityId: vehiculoId,
        entityName: veh.nombre,
        description: `Actualizó kilometraje de ${veh.nombre}: ${veh.kilometraje} km → ${kmNuevo} km`,
        actor: req.user,
      });
    }

    await conn.commit();
    res.status(201).json({ ok: true });
  } catch (e) {
    try { await conn.rollback(); } catch {}
    next(e);
  } finally {
    conn.release();
  }
});

/** DELETE /api/maintenance/:vehiculoId/:id */
router.delete("/:vehiculoId/:id", auth, async (req: AuthedRequest, res, next) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const vehiculoId = Number(req.params.vehiculoId);
    const id = (req.params.id || "").toString();

    const [rows] = await conn.query(
      `SELECT m.servicio,
              DATE_FORMAT(m.fecha, '%Y-%m-%d') AS fechaISO,
              v.placa,
              v.nombre
       FROM mantenimientos m
       JOIN vehiculos v ON v.id = m.vehiculo_id
       WHERE m.vehiculo_id = :vehiculoId AND m.id = :id
       LIMIT 1`,
      { vehiculoId, id }
    );
    const prev = (rows as any[])[0];

    await conn.query(`DELETE FROM mantenimientos WHERE vehiculo_id = :vehiculoId AND id = :id`, {
      vehiculoId,
      id,
    });

    if (prev) {
      await logMovement(conn, {
        type: "delete",
        entity: "mantenimiento",
        entityId: id,
        entityName: `${prev.nombre} - ${prev.servicio}`,
        description: `Se eliminó el servicio de ${prev.servicio} del vehículo ${prev.nombre} con placa ${prev.placa} (fecha: ${prev.fechaISO})`,
        actor: req.user,
      });
    }

    await conn.commit();
    res.json({ ok: true });
  } catch (e) {
    try { await conn.rollback(); } catch {}
    next(e);
  } finally {
    conn.release();
  }
});

export default router;
