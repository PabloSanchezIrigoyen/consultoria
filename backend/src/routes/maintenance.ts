// backend/src/routes/maintenance.ts
import { Router } from "express";
import type { PoolClient } from "pg";
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

    const { rows } = await pool.query(
      `SELECT id,
              vehiculo_id AS "vehiculoId",
              TO_CHAR(fecha, 'YYYY-MM-DD') AS "fechaISO",
              servicio, kilometraje, lugar, importe, notas
       FROM mantenimientos
       WHERE vehiculo_id = $1
       ORDER BY fecha DESC, id DESC`,
      [vehiculoId]
    );

    res.json(rows);
  } catch (e) {
    next(e);
  }
});

/** POST /api/maintenance */
router.post("/", auth, async (req: AuthedRequest, res, next) => {
  const { vehiculoId, fechaISO, servicio, kilometraje, lugar, importe, notas } = req.body || {};

  if (!vehiculoId || !fechaISO || !servicio?.trim())
    return res.status(400).json({ error: "vehiculoId, fechaISO y servicio son requeridos" });

  const createdBy = req.user?.id;
  if (!createdBy)
    return res.status(401).json({ error: "usuario_no_autenticado" });

  let client: PoolClient | undefined;
  try {
    const conn = client = await pool.connect();
    await conn.query("BEGIN");

    // Verificar vehículo
    const { rows: vehRows } = await conn.query(
      `SELECT id, nombre, placa, kilometraje
       FROM vehiculos
       WHERE id = $1
       LIMIT 1`,
      [Number(vehiculoId)]
    );
    const veh = vehRows[0];
    if (!veh) {
      await conn.query("ROLLBACK");
      return res.status(404).json({ error: "vehiculo_no_encontrado" });
    }

    // Crear mantenimiento con UUID
    const mantenimientoId = randomUUID();

    await conn.query(
      `INSERT INTO mantenimientos
       (id, vehiculo_id, fecha, servicio, kilometraje, lugar, importe, notas, created_by)
       VALUES
       ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        mantenimientoId,
        Number(vehiculoId),
        fechaISO,
        String(servicio).trim(),
        Number(kilometraje ?? 0),
        (lugar ?? "").toString(),
        Number(importe ?? 0),
        (notas ?? "").toString(),
        createdBy,
      ]
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
      await conn.query(`UPDATE vehiculos SET kilometraje = $1 WHERE id = $2`, [
        kmNuevo,
        Number(vehiculoId),
      ]);

      await logMovement(conn, {
        type: "update",
        entity: "vehiculo",
        entityId: vehiculoId,
        entityName: veh.nombre,
        description: `Actualizó kilometraje de ${veh.nombre}: ${veh.kilometraje} km → ${kmNuevo} km`,
        actor: req.user,
      });
    }

    await conn.query("COMMIT");
    res.status(201).json({ ok: true });
  } catch (e) {
    if (client) try { await client.query("ROLLBACK"); } catch {}
    next(e);
  } finally {
    client?.release();
  }
});

/** DELETE /api/maintenance/:vehiculoId/:id */
router.delete("/:vehiculoId/:id", auth, async (req: AuthedRequest, res, next) => {
  let client: PoolClient | undefined;
  try {
    const conn = client = await pool.connect();
    await conn.query("BEGIN");

    const vehiculoId = Number(req.params.vehiculoId);
    const id = (req.params.id || "").toString();

    const { rows } = await conn.query(
      `SELECT m.servicio,
              TO_CHAR(m.fecha, 'YYYY-MM-DD') AS "fechaISO",
              v.placa,
              v.nombre
       FROM mantenimientos m
       JOIN vehiculos v ON v.id = m.vehiculo_id
       WHERE m.vehiculo_id = $1 AND m.id = $2
       LIMIT 1`,
      [vehiculoId, id]
    );
    const prev = rows[0];

    await conn.query(`DELETE FROM mantenimientos WHERE vehiculo_id = $1 AND id = $2`, [
      vehiculoId,
      id,
    ]);

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

    await conn.query("COMMIT");
    res.json({ ok: true });
  } catch (e) {
    if (client) try { await client.query("ROLLBACK"); } catch {}
    next(e);
  } finally {
    client?.release();
  }
});

export default router;
