'use strict';

const request = require('supertest');
const { buildTestApp, donante } = require('../helpers/testApp');

describe('Cabeceras de seguridad (corrección de hallazgos de OWASP ZAP)', () => {
  let res;
  beforeAll(async () => {
    const ctx = await buildTestApp();
    res = await request(ctx.app).get('/health').set('Origin', 'http://localhost:5173');
  });

  test('no revela la tecnología del servidor (X-Powered-By)', () => {
    expect(res.headers['x-powered-by']).toBeUndefined();
  });

  test('envía X-Content-Type-Options: nosniff', () => {
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });

  test('envía una Content-Security-Policy restrictiva', () => {
    expect(res.headers['content-security-policy']).toContain("default-src 'none'");
    expect(res.headers['content-security-policy']).toContain("frame-ancestors 'none'");
  });

  test('impide guardar respuestas en caché', () => {
    expect(res.headers['cache-control']).toBe('no-store');
  });

  test('envía Strict-Transport-Security', () => {
    expect(res.headers['strict-transport-security']).toMatch(/max-age=/);
  });

  test('CORS solo permite los orígenes configurados', async () => {
    const ctx = await buildTestApp();
    const permitido = await request(ctx.app).get('/health').set('Origin', 'http://localhost:5173');
    const ajeno = await request(ctx.app).get('/health').set('Origin', 'https://sitio-malicioso.com');
    expect(permitido.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    expect(ajeno.headers['access-control-allow-origin']).toBeUndefined();
  });
});

describe('Límite de intentos (fuerza bruta)', () => {
  test('bloquea con 429 después de superar el límite de intentos de login', async () => {
    const ctx = await buildTestApp({ loginRateLimit: 3 });
    await request(ctx.app).post('/api/auth/register').send(donante());
    const intento = () =>
      request(ctx.app).post('/api/auth/login').send({ email: 'donante@ejemplo.com', password: 'Mala2026x' });

    const codigos = [];
    for (let i = 0; i < 4; i += 1) codigos.push((await intento()).status);

    expect(codigos.slice(0, 2)).toEqual([401, 401]);
    expect(codigos[3]).toBe(429);
  });
});
