'use strict';

const { loadConfig } = require('./config');
const { createPool, migrate } = require('./db');
const { createApp } = require('./app');

async function waitForDatabase(pool, attempts = 20) {
  for (let i = 1; i <= attempts; i += 1) {
    try {
      await pool.query('SELECT 1');
      return;
    } catch (err) {
      if (i === attempts) throw err;
      console.log(`Esperando base de datos (${i}/${attempts})...`);
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }
}

async function main() {
  const config = loadConfig();
  const pool = createPool(config.databaseUrl);
  await waitForDatabase(pool);
  await migrate(pool);

  const app = createApp({ db: pool, config });
  const admin = await app.locals.authService.ensureAdmin({
    email: config.adminEmail,
    password: config.adminPassword,
  });
  if (admin) console.log(`Administrador inicial creado: ${admin.email}`);

  app.listen(config.port, () => {
    console.log(`auth-service escuchando en el puerto ${config.port}`);
  });
}

main().catch((err) => {
  console.error('No se pudo iniciar el servicio:', err.message);
  process.exit(1);
});
