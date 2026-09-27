'use strict';

// Columnas que se pueden exponer (nunca password_hash).
const PUBLIC_COLUMNS =
  'id, nombre, email, rol, tipo_donante, organizacion, telefono, ciudad, activo, creado_en';

/**
 * Acceso a datos de usuarios. Todas las consultas son parametrizadas ($1, $2...),
 * lo que evita inyección SQL aunque la entrada contenga comillas o comandos.
 */
function createUserRepository(db) {
  return {
    async create(user) {
      const { rows } = await db.query(
        `INSERT INTO users (nombre, email, password_hash, rol, tipo_donante, organizacion, telefono, ciudad)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING ${PUBLIC_COLUMNS}`,
        [
          user.nombre,
          user.email,
          user.passwordHash,
          user.rol,
          user.tipo_donante,
          user.organizacion ?? null,
          user.telefono ?? null,
          user.ciudad ?? null,
        ],
      );
      return rows[0];
    },

    /** Incluye password_hash: solo para uso interno del login. */
    async findByEmailWithHash(email) {
      const { rows } = await db.query(
        `SELECT ${PUBLIC_COLUMNS}, password_hash FROM users WHERE email = $1`,
        [email],
      );
      return rows[0] ?? null;
    },

    async findById(id) {
      const { rows } = await db.query(`SELECT ${PUBLIC_COLUMNS} FROM users WHERE id = $1`, [id]);
      return rows[0] ?? null;
    },

    async list({ limit, offset }) {
      const { rows } = await db.query(
        `SELECT ${PUBLIC_COLUMNS} FROM users ORDER BY id LIMIT $1 OFFSET $2`,
        [limit, offset],
      );
      return rows;
    },

    async updateRole(id, rol) {
      const { rows } = await db.query(
        `UPDATE users SET rol = $1 WHERE id = $2 RETURNING ${PUBLIC_COLUMNS}`,
        [rol, id],
      );
      return rows[0] ?? null;
    },

    async setActive(id, activo) {
      const { rows } = await db.query(
        `UPDATE users SET activo = $1 WHERE id = $2 RETURNING ${PUBLIC_COLUMNS}`,
        [activo, id],
      );
      return rows[0] ?? null;
    },
  };
}

module.exports = { createUserRepository };
