'use strict';

const { loadConfig } = require('../../src/config');

describe('loadConfig', () => {
  test('usa valores por defecto cuando no hay variables de entorno', () => {
    const config = loadConfig({});
    expect(config.port).toBe(3000);
    expect(config.jwtExpiresIn).toBe('1h');
    expect(config.bcryptRounds).toBe(10);
    expect(config.nodeEnv).toBe('development');
  });

  test('toma los valores de las variables de entorno', () => {
    const config = loadConfig({
      NODE_ENV: 'production',
      PORT: '8080',
      DATABASE_URL: 'postgres://u:p@db:5432/alimenta',
      JWT_SECRET: 'x'.repeat(40),
      JWT_EXPIRES_IN: '15m',
      BCRYPT_ROUNDS: '12',
      CORS_ORIGIN: 'https://alimenta.mx',
      ADMIN_EMAIL: 'admin@alimenta.mx',
      ADMIN_PASSWORD: 'Admin2026x',
    });
    expect(config).toMatchObject({
      nodeEnv: 'production',
      port: 8080,
      databaseUrl: 'postgres://u:p@db:5432/alimenta',
      jwtSecret: 'x'.repeat(40),
      jwtExpiresIn: '15m',
      bcryptRounds: 12,
      corsOrigin: 'https://alimenta.mx',
      adminEmail: 'admin@alimenta.mx',
      adminPassword: 'Admin2026x',
    });
  });
});
