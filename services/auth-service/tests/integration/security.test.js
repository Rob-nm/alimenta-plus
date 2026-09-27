'use strict';

const request = require('supertest');
const jwt = require('jsonwebtoken');
const { buildTestApp, donante, TEST_CONFIG } = require('../helpers/testApp');

let ctx;
beforeEach(async () => {
  ctx = await buildTestApp();
  await request(ctx.app).post('/api/auth/register').send(donante());
});

describe('Inyección SQL', () => {
  test.each([
    "' OR '1'='1",
    "admin@alimenta.mx'--",
    "x@y.mx'; DROP TABLE users;--",
  ])('el correo %p se rechaza en la validación', async (email) => {
    const res = await request(ctx.app).post('/api/auth/login').send({ email, password: 'x' });
    expect(res.status).toBe(400);
  });

  test('una contraseña con SQL no permite entrar (consulta parametrizada)', async () => {
    const res = await request(ctx.app)
      .post('/api/auth/login')
      .send({ email: 'donante@ejemplo.com', password: "' OR '1'='1" });
    expect(res.status).toBe(401);
  });

  test('un nombre con SQL se rechaza y la tabla sigue intacta', async () => {
    const res = await request(ctx.app)
      .post('/api/auth/register')
      .send(donante({ email: 'otro@ejemplo.com', nombre: "Robert'); DROP TABLE users;--" }));
    expect(res.status).toBe(400);
    const { rows } = await ctx.db.query('SELECT COUNT(*) AS total FROM users');
    expect(Number(rows[0].total)).toBe(1);
  });
});

describe('XSS (Cross-Site Scripting)', () => {
  test.each([
    ['nombre', '<script>alert(1)</script>'],
    ['organizacion', '<img src=x onerror=alert(1)>'],
    ['ciudad', 'Monterrey"><svg onload=alert(1)>'],
  ])('%s con código HTML/JS → 400', async (campo, valor) => {
    const res = await request(ctx.app)
      .post('/api/auth/register')
      .send(donante({ email: 'xss@ejemplo.com', [campo]: valor }));
    expect(res.status).toBe(400);
  });

  test('las respuestas se envían como JSON, no como HTML', async () => {
    const res = await request(ctx.app).get('/health');
    expect(res.headers['content-type']).toMatch(/application\/json/);
  });
});

describe('Manipulación de JWT', () => {
  const opts = { issuer: 'alimenta-plus', audience: 'alimenta-plus-api' };

  test('token con firma alterada → 401', async () => {
    const { token } = await ctx.authService.login('donante@ejemplo.com', 'Donante2026');
    const [header, , firma] = token.split('.');
    const payloadAdmin = Buffer.from(JSON.stringify({ sub: '1', rol: 'admin' })).toString('base64url');
    const res = await request(ctx.app)
      .get('/api/users')
      .set('Authorization', `Bearer ${header}.${payloadAdmin}.${firma}`);
    expect(res.status).toBe(401);
  });

  test('token sin firma (alg: none) → 401', async () => {
    const token = jwt.sign({ sub: '1', rol: 'admin' }, null, { ...opts, algorithm: 'none' });
    const res = await request(ctx.app).get('/api/users').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(401);
  });

  test('token expirado → 401', async () => {
    const token = jwt.sign({ sub: '1', rol: 'admin', exp: Math.floor(Date.now() / 1000) - 60 }, TEST_CONFIG.jwtSecret, opts);
    const res = await request(ctx.app).get('/api/users').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(401);
  });
});
