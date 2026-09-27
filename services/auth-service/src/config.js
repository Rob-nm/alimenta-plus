'use strict';

const MIN_SECRET_LENGTH = 32;

/**
 * Configuración del servicio a partir de variables de entorno.
 * JWT_SECRET es obligatorio y debe tener al menos 32 caracteres:
 * no existe un secreto por defecto en el código.
 */
function loadConfig(env = process.env) {
  const jwtSecret = env.JWT_SECRET;
  if (!jwtSecret || jwtSecret.length < MIN_SECRET_LENGTH) {
    throw new Error(`JWT_SECRET es obligatorio y debe tener al menos ${MIN_SECRET_LENGTH} caracteres`);
  }
  return {
    nodeEnv: env.NODE_ENV || 'development',
    port: Number(env.PORT) || 3000,
    databaseUrl: env.DATABASE_URL,
    jwtSecret,
    jwtExpiresIn: env.JWT_EXPIRES_IN || '1h',
    bcryptRounds: Number(env.BCRYPT_ROUNDS) || 10,
    corsOrigin: (env.CORS_ORIGIN || 'http://localhost:5173').split(',').map((o) => o.trim()),
    loginRateLimit: Number(env.LOGIN_RATE_LIMIT) || 10,
    adminEmail: env.ADMIN_EMAIL,
    adminPassword: env.ADMIN_PASSWORD,
  };
}

module.exports = { loadConfig, MIN_SECRET_LENGTH };
