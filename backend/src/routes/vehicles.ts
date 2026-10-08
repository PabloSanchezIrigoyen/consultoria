// src/routes/vehicles.ts
import { Router } from "express";
import { pool } from "../db";
import { auth, AuthedRequest } from "../middleware/auth";
import { logMovement } from "../utils/logMovement";

const router = Router();

/** GET /api/vehicles (pública) */
router.get("/", async (_req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT
         id,
         nombre,
         placa,
         marca,
         motor,
         modelo,
         numero_serie   AS numeroSerie,
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
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const { nombre, placa, marca, motor, modelo, numeroSerie, estado, kilometraje } = req.body || {};
    if (!nombre || !placa || !modelo || !numeroSerie) {
      return res.status(400).json({ error: "datos_requeridos" });
    }

    const createdBy = req.user?.id ?? null;

    const [result] = await conn.query(
      `INSERT INTO vehiculos
         (nombre, placa, marca, motor, modelo, numero_serie, estado, kilometraje, created_by)
       VALUES
         (:nombre, :placa, :marca, :motor, :modelo, :numeroSerie, :estado, :kilometraje, :created_by)`,
      {
        nombre,
        placa,
        marca: marca ?? "",
        motor: motor ?? "",
        modelo,
        numeroSerie,
        estado: estado ?? "activo",
        kilometraje: Number.isFinite(kilometraje) ? kilometraje : 0,
        created_by: createdBy,
      }
    );
    const id = (result as any).insertId as number;

    await logMovement(conn, {
      type: "create",
      entity: "vehiculo",
      entityId: id,
      entityName: nombre,
      description: `Agregó vehículo “${nombre}” con placa (${placa})`,
      actor: req.user,
    });

    await conn.commit();
    res.status(201).json({ ok: true, id });
  } catch (e: any) {
    try { await conn.rollback(); } catch {}
    if (e?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        error: "placa_duplicada",
        message: "La placa ya está registrada en otro vehículo"
      });
    }
    next(e);
  } finally {
    conn.release();
  }
});

/** PUT /api/vehicles/:id (protegida) */
router.put("/:id", auth, async (req: AuthedRequest, res, next) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const id = Number(req.params.id);
    const { nombre, placa, marca, motor, modelo, numeroSerie, estado, kilometraje } = req.body || {};
    if (!id) return res.status(400).json({ error: "id_invalido" });

    const [prevRows] = await conn.query(
      `SELECT * FROM vehiculos WHERE id = :id LIMIT 1`,
      { id }
    );
    const prev = (prevRows as any[])[0];

    await conn.query(
      `UPDATE vehiculos
       SET nombre=:nombre,
           placa=:placa,
           marca=:marca,
           motor=:motor,
           modelo=:modelo,
           numero_serie=:numeroSerie,
           estado=:estado,
           kilometraje=:kilometraje
       WHERE id=:id`,
      {
        id,
        nombre,
        placa,
        marca: marca ?? "",
        motor: motor ?? "",
        modelo,
        numeroSerie,
        estado: estado ?? "activo",
        kilometraje: Number.isFinite(kilometraje) ? kilometraje : 0,
      }
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

    await conn.commit();
    res.json({ ok: true });
  } catch (e: any) {
    try { await conn.rollback(); } catch {}
    if (e?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        error: "placa_duplicada",
        message: "La placa ya está registrada en otro vehículo"
      });
    }
    next(e);
  } finally {
    conn.release();
  }
});

/** DELETE /api/vehicles/:id (protegida) — SOFT DELETE (estado='baja') */
router.delete("/:id", auth, async (req: AuthedRequest, res, next) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const id = Number(req.params.id);
    if (!id) {
      await conn.rollback();
      return res.status(400).json({ error: "id_invalido" });
    }

    const [rows] = await conn.query(
      `SELECT id, nombre, placa, estado FROM vehiculos WHERE id = :id LIMIT 1`,
      { id }
    );
    const veh = (rows as any[])[0];
    if (!veh) {
      await conn.rollback();
      return res.status(404).json({ error: "vehiculo_no_encontrado" });
    }

    if (veh.estado === "baja") {
      await conn.commit();
      return res.json({ ok: true, softDeleted: true, already: true });
    }

    await conn.query(`UPDATE vehiculos SET estado = 'baja' WHERE id = :id`, { id });

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

    await conn.commit();
    res.json({ ok: true, softDeleted: true });
  } catch (e) {
    try { await conn.rollback(); } catch {}
    next(e);
  } finally {
    conn.release();
  }
});

export default router;
