'use strict';

const request = require('supertest');
const { buildTestApp, donante } = require('../helpers/testApp');

let ctx;
beforeEach(async () => {
  ctx = await buildTestApp();
});

describe('Endpoints generales', () => {
  test('GET /health', async () => {
    const res = await request(ctx.app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ estado: 'ok', servicio: 'auth-service' });
  });

  test('GET /api-docs/openapi.json publica la especificación', async () => {
    const res = await request(ctx.app).get('/api-docs/openapi.json');
    expect(res.status).toBe(200);
    expect(res.body.openapi).toBe('3.0.3');
  });

  test('ruta inexistente → 404', async () => {
    const res = await request(ctx.app).get('/no-existe');
    expect(res.status).toBe(404);
  });

  test('JSON mal formado → 400', async () => {
    const res = await request(ctx.app)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send('{"email": ');
    expect(res.status).toBe(400);
  });

  test('cuerpo mayor a 10 kb → 413', async () => {
    const res = await request(ctx.app)
      .post('/api/auth/register')
      .send(donante({ nombre: 'a'.repeat(20_000) }));
    expect(res.status).toBe(413);
  });
});

describe('POST /api/auth/register', () => {
  test('registra un donante y nunca devuelve la contraseña', async () => {
    const res = await request(ctx.app).post('/api/auth/register').send(donante());
    expect(res.status).toBe(201);
    expect(res.body.usuario).toMatchObject({
      id: 1,
      email: 'donante@ejemplo.com',
      rol: 'usuario',
      tipo_donante: 'restaurante',
      activo: true,
    });
    expect(JSON.stringify(res.body)).not.toMatch(/password/);
  });

  test('los campos opcionales pueden omitirse', async () => {
    const { organizacion: _o, telefono: _t, ciudad: _c, ...minimo } = donante();
    const res = await request(ctx.app).post('/api/auth/register').send(minimo);
    expect(res.status).toBe(201);
    expect(res.body.usuario.organizacion).toBeNull();
  });

  test('correo duplicado (sin importar mayúsculas) → 409', async () => {
    await request(ctx.app).post('/api/auth/register').send(donante());
    const res = await request(ctx.app)
      .post('/api/auth/register')
      .send(donante({ email: 'DONANTE@ejemplo.com' }));
    expect(res.status).toBe(409);
  });

  test('datos inválidos → 400 con detalle por campo', async () => {
    const res = await request(ctx.app)
      .post('/api/auth/register')
      .send(donante({ email: 'no-es-correo', password: 'corta', tipo_donante: 'otro' }));
    expect(res.status).toBe(400);
    const campos = res.body.detalles.map((d) => d.campo);
    expect(campos).toEqual(expect.arrayContaining(['email', 'password', 'tipo_donante']));
  });

  test('no permite auto-asignarse el rol admin', async () => {
    const res = await request(ctx.app).post('/api/auth/register').send(donante({ rol: 'admin' }));
    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/login y GET /api/auth/me', () => {
  beforeEach(async () => {
    await request(ctx.app).post('/api/auth/register').send(donante());
  });

  test('login correcto devuelve token Bearer', async () => {
    const res = await request(ctx.app)
      .post('/api/auth/login')
      .send({ email: 'donante@ejemplo.com', password: 'Donante2026' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ tipo: 'Bearer', expiraEn: '1h' });
    expect(res.body.token.split('.')).toHaveLength(3);
  });

  test('contraseña incorrecta → 401', async () => {
    const res = await request(ctx.app)
      .post('/api/auth/login')
      .send({ email: 'donante@ejemplo.com', password: 'Otra2026x' });
    expect(res.status).toBe(401);
  });

  test('GET /me con token devuelve el perfil', async () => {
    const login = await request(ctx.app)
      .post('/api/auth/login')
      .send({ email: 'donante@ejemplo.com', password: 'Donante2026' });
    const res = await request(ctx.app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${login.body.token}`);
    expect(res.status).toBe(200);
    expect(res.body.usuario.email).toBe('donante@ejemplo.com');
  });

  test('GET /me sin token → 401', async () => {
    const res = await request(ctx.app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  test('GET /me con token de un usuario que ya no existe → 404', async () => {
    const token = ctx.authService.signToken({ id: 999, email: 'x@y.mx', rol: 'usuario' });
    const res = await request(ctx.app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});
