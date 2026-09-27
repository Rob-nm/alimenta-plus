'use strict';

/**
 * Configuración del servicio a partir de variables de entorno.
 */
function loadConfig(env = process.env) {
  return {
    nodeEnv: env.NODE_ENV || 'development',
    port: Number(env.PORT) || 3000,
    databaseUrl: env.DATABASE_URL,
    jwtSecret: env.JWT_SECRET || 'alimenta-dev-secret-cambiar-en-produccion',
    jwtExpiresIn: env.JWT_EXPIRES_IN || '1h',
    bcryptRounds: Number(env.BCRYPT_ROUNDS) || 10,
    corsOrigin: env.CORS_ORIGIN || '*',
    adminEmail: env.ADMIN_EMAIL,
    adminPassword: env.ADMIN_PASSWORD,
  };
}

module.exports = { loadConfig };
