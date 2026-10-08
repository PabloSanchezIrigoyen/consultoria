// src/routes/vehicles.ts
import { Router } from "express";
import type { PoolClient } from "pg";
import { pool } from "../db";
import { auth, AuthedRequest } from "../middleware/auth";
import { logMovement } from "../utils/logMovement";

const router = Router();

/** GET /api/vehicles (pública) */
router.get("/", async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT
         id,
         nombre,
         placa,
         marca,
         motor,
         modelo,
         numero_serie   AS "numeroSerie",
         estado,
         kilometraje
       FROM vehiculos
       WHERE estado != 'baja'
       ORDER BY id ASC`
    );
    res.json(rows);
  } catch (e) {
    next(e);
  }
});

/** POST /api/vehicles (protegida) */
router.post("/", auth, async (req: AuthedRequest, res, next) => {
  const { nombre, placa, marca, motor, modelo, numeroSerie, estado, kilometraje } = req.body || {};
  if (!nombre || !placa || !modelo || !numeroSerie) {
    return res.status(400).json({ error: "datos_requeridos" });
  }

  let client: PoolClient | undefined;
  try {
    const conn = client = await pool.connect();
    await conn.query("BEGIN");

    const createdBy = req.user?.id ?? null;

    const { rows } = await conn.query(
      `INSERT INTO vehiculos
         (nombre, placa, marca, motor, modelo, numero_serie, estado, kilometraje, created_by)
       VALUES
         ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id`,
      [
        nombre,
        placa,
        marca ?? "",
        motor ?? "",
        modelo,
        numeroSerie,
        estado ?? "activo",
        Number.isFinite(kilometraje) ? kilometraje : 0,
        createdBy,
      ]
    );
    const id = Number(rows[0].id);

    await logMovement(conn, {
      type: "create",
      entity: "vehiculo",
      entityId: id,
      entityName: nombre,
      description: `Agregó vehículo “${nombre}” con placa (${placa})`,
      actor: req.user,
    });

    await conn.query("COMMIT");
    res.status(201).json({ ok: true, id });
  } catch (e: any) {
    if (client) try { await client.query("ROLLBACK"); } catch {}
    if (e?.code === "23505") {
      return res.status(409).json({
        error: "placa_duplicada",
        message: "La placa ya está registrada en otro vehículo"
      });
    }
    next(e);
  } finally {
    client?.release();
  }
});

/** PUT /api/vehicles/:id (protegida) */
router.put("/:id", auth, async (req: AuthedRequest, res, next) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "id_invalido" });

  let client: PoolClient | undefined;
  try {
    const conn = client = await pool.connect();
    await conn.query("BEGIN");

    const { nombre, placa, marca, motor, modelo, numeroSerie, estado, kilometraje } = req.body || {};

    const { rows: prevRows } = await conn.query(
      `SELECT * FROM vehiculos WHERE id = $1 LIMIT 1`,
      [id]
    );
    const prev = prevRows[0];

    await conn.query(
      `UPDATE vehiculos
       SET        nombre=$1,
       placa=$2,
       marca=$3,
       motor=$4,
       modelo=$5,
       numero_serie=$6,
       estado=$7,
       kilometraje=$8
       WHERE id=$9`,
      [
        nombre,
        placa,
        marca ?? "",
        motor ?? "",
        modelo,
        numeroSerie,
        estado ?? "activo",
        Number.isFinite(kilometraje) ? kilometraje : 0,
        id,
      ]
    );

    if (prev) {
      const cambios: string[] = [];
      if (prev.placa !== placa) cambios.push(`placa “${prev.placa}” → “${placa}”`);
      if (prev.nombre !== nombre) cambios.push(`nombre “${prev.nombre}” → “${nombre}”`);
      if (prev.modelo !== modelo) cambios.push(`modelo “${prev.modelo}” → “${modelo}”`);
      if (prev.estado !== estado) cambios.push(`estado ${prev.estado} → ${estado}`);
      if (Number(prev.kilometraje) !== Number(kilometraje))
        cambios.push(`km ${prev.kilometraje} → ${kilometraje}`);

      await logMovement(conn, {
        type: "update",
        entity: "vehiculo",
        entityId: id,
        entityName: nombre,
        description: cambios.length
          ? `Actualizó “${placa}”: ${cambios.join(", ")}`
          : `Actualizó “${placa}”`,
        actor: req.user,
      });
    }

    await conn.query("COMMIT");
    res.json({ ok: true });
  } catch (e: any) {
    if (client) try { await client.query("ROLLBACK"); } catch {}
    if (e?.code === "23505") {
      return res.status(409).json({
        error: "placa_duplicada",
        message: "La placa ya está registrada en otro vehículo"
      });
    }
    next(e);
  } finally {
    client?.release();
  }
});

/** DELETE /api/vehicles/:id (protegida) — SOFT DELETE (estado='baja') */
router.delete("/:id", auth, async (req: AuthedRequest, res, next) => {
  let client: PoolClient | undefined;
  try {
    const conn = client = await pool.connect();
    await conn.query("BEGIN");

    const id = Number(req.params.id);
    if (!id) {
      await conn.query("ROLLBACK");
      return res.status(400).json({ error: "id_invalido" });
    }

    const { rows } = await conn.query(
      `SELECT id, nombre, placa, estado FROM vehiculos WHERE id = $1 LIMIT 1`,
      [id]
    );
    const veh = rows[0];
    if (!veh) {
      await conn.query("ROLLBACK");
      return res.status(404).json({ error: "vehiculo_no_encontrado" });
    }

    if (veh.estado === "baja") {
      await conn.query("COMMIT");
      return res.json({ ok: true, softDeleted: true, already: true });
    }

    await conn.query(`UPDATE vehiculos SET estado = 'baja' WHERE id = $1`, [id]);

    const motivo =
      (req.query.motivo as string) ||
      (req.body?.motivo as string) ||
      "";
    const detalle =
      (req.query.detalle as string) ||
      (req.body?.detalle as string) ||
      "";

    const base = `Baja de vehículo ${veh.placa} (${veh.nombre})`;
    const description = motivo
      ? `${base}. Motivo: ${motivo}${detalle ? `. Detalle: ${detalle}` : ""}`
      : base;

    try {
      await logMovement(conn, {
        type: "delete",
        entity: "vehiculo",
        entityId: id,
        entityName: veh.nombre,
        description,
        actor: req.user,
      });
    } catch (e) {
      console.error("logMovement (vehiculo baja) failed:", e);
    }

    await conn.query("COMMIT");
    res.json({ ok: true, softDeleted: true });
  } catch (e) {
    if (client) try { await client.query("ROLLBACK"); } catch {}
    next(e);
  } finally {
    client?.release();
  }
});

export default router;
