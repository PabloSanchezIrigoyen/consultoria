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
       (:tipo, :entidad, :entidad_id, :nombre_entidad, :descripcion, :fecha_hora,
        :nombre_actor, :correo_actor, :rol_actor)`,
    {
      tipo: type,
      entidad: entity,
      entidad_id: entityId ?? null,
      nombre_entidad: entityName ?? null,
      descripcion: description ?? "",   // ← aquí ya usamos la que existe
      fecha_hora: ts ?? new Date(),
      nombre_actor: actor?.name ?? null,
      correo_actor: actor?.email ?? null,
      rol_actor: actor?.role ?? null,
    }
  );
}
