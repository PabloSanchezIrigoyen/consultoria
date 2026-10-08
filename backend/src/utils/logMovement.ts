// src/utils/logMovement.ts

export async function logMovement(
  connOrPool: any,
  opts: {
    type: "create" | "update" | "delete";
    entity: string;
    entityId?: string | number | null;
    entityName?: string | null;
    description: string; // ← en el backend la variable sigue siendo description
    ts?: Date;
    actor?: { name?: string | null; email?: string | null; role?: string | null };
  }
) {
  const {
    type,
    entity,
    entityId,
    entityName,
    description, // ← esta es la que existe
    ts,
    actor,
  } = opts;

  await connOrPool.query(
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
      description ?? "",
      ts ?? new Date(),
      actor?.name ?? null,
      actor?.email ?? null,
      actor?.role ?? null,
    ]
  );
}
