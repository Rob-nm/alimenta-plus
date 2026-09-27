'use strict';

const { loadConfig } = require('../../src/config');

const SECRET = 'x'.repeat(40);

describe('loadConfig', () => {
  test('falla si no se define JWT_SECRET (no hay secreto por defecto en el código)', () => {
    expect(() => loadConfig({})).toThrow(/JWT_SECRET/);
  });

  test('falla si JWT_SECRET tiene menos de 32 caracteres', () => {
    expect(() => loadConfig({ JWT_SECRET: 'corto' })).toThrow(/32/);
  });

  test('usa valores por defecto seguros para lo demás', () => {
    const config = loadConfig({ JWT_SECRET: SECRET });
    expect(config).toMatchObject({
      nodeEnv: 'development',
      port: 3000,
      jwtExpiresIn: '1h',
      bcryptRounds: 10,
      corsOrigin: ['http://localhost:5173'],
      loginRateLimit: 10,
    });
  });

  test('toma los valores de las variables de entorno', () => {
    const config = loadConfig({
      NODE_ENV: 'production',
      PORT: '8080',
      DATABASE_URL: 'postgres://u:p@db:5432/alimenta',
      JWT_SECRET: SECRET,
      JWT_EXPIRES_IN: '15m',
      BCRYPT_ROUNDS: '12',
      CORS_ORIGIN: 'https://alimenta.mx, https://admin.alimenta.mx',
      LOGIN_RATE_LIMIT: '5',
      ADMIN_EMAIL: 'admin@alimenta.mx',
      ADMIN_PASSWORD: 'Admin2026x',
    });
    expect(config).toMatchObject({
      nodeEnv: 'production',
      port: 8080,
      databaseUrl: 'postgres://u:p@db:5432/alimenta',
      jwtSecret: SECRET,
      jwtExpiresIn: '15m',
      bcryptRounds: 12,
      corsOrigin: ['https://alimenta.mx', 'https://admin.alimenta.mx'],
      loginRateLimit: 5,
      adminEmail: 'admin@alimenta.mx',
      adminPassword: 'Admin2026x',
    });
  });
});
