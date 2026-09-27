'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { Pool } = require('pg');

function createPool(databaseUrl) {
  return new Pool({ connectionString: databaseUrl });
}

/** Crea las tablas si no existen. `db` es cualquier objeto con query(text, params). */
async function migrate(db) {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await db.query(sql);
}

module.exports = { createPool, migrate };
