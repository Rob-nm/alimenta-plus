'use strict';

const { newDb } = require('pg-mem');
const { migrate } = require('../../src/db');
const { createApp } = require('../../src/app');

const TEST_CONFIG = Object.freeze({
  nodeEnv: 'test',
  jwtSecret: 'secreto-de-pruebas-con-al-menos-32-caracteres',
  jwtExpiresIn: '1h',
  bcryptRounds: 4,
  corsOrigin: ['http://localhost:5173'],
  loginRateLimit: 1000,
});

const ADMIN = Object.freeze({ email: 'admin@alimenta.mx', password: 'Admin2026x' });

/** App completa sobre una base PostgreSQL en memoria (pg-mem). */
async function buildTestApp(overrides = {}) {
  const mem = newDb();
  const { Pool } = mem.adapters.createPg();
  const db = new Pool();
  await migrate(db);
  const config = { ...TEST_CONFIG, ...overrides };
  const app = createApp({ db, config });
  return { app, db, config, authService: app.locals.authService };
}

function donante(overrides = {}) {
  return {
    nombre: 'Restaurante La Esquina',
    email: 'donante@ejemplo.com',
    password: 'Donante2026',
    tipo_donante: 'restaurante',
    organizacion: 'La Esquina SA de CV',
    telefono: '8112345678',
    ciudad: 'Monterrey',
    ...overrides,
  };
}

async function loginAdmin(ctx) {
  await ctx.authService.ensureAdmin(ADMIN);
  return ctx.authService.login(ADMIN.email, ADMIN.password);
}

module.exports = { buildTestApp, donante, loginAdmin, TEST_CONFIG, ADMIN };
