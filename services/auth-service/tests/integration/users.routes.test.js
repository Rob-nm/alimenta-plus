'use strict';

const request = require('supertest');
const { buildTestApp, donante, loginAdmin } = require('../helpers/testApp');

let ctx;
let adminToken;
let adminId;
let donorToken;
let donorId;

beforeEach(async () => {
  ctx = await buildTestApp();
  const admin = await loginAdmin(ctx);
  adminToken = admin.token;
  adminId = admin.usuario.id;

  const reg = await request(ctx.app).post('/api/auth/register').send(donante());
  donorId = reg.body.usuario.id;
  donorToken = (await ctx.authService.login('donante@ejemplo.com', 'Donante2026')).token;
});

const asAdmin = (req) => req.set('Authorization', `Bearer ${adminToken}`);

describe('Control de acceso por rol', () => {
  test('sin token → 401', async () => {
    const res = await request(ctx.app).get('/api/users');
    expect(res.status).toBe(401);
  });

  test('rol usuario (donante) → 403', async () => {
    const res = await request(ctx.app).get('/api/users').set('Authorization', `Bearer ${donorToken}`);
    expect(res.status).toBe(403);
  });

  test('rol admin → 200', async () => {
    const res = await asAdmin(request(ctx.app).get('/api/users'));
    expect(res.status).toBe(200);
    expect(res.body.usuarios).toHaveLength(2);
    expect(res.body).toMatchObject({ limit: 20, offset: 0 });
  });
});

describe('GET /api/users', () => {
  test('respeta limit y offset', async () => {
    const res = await asAdmin(request(ctx.app).get('/api/users?limit=1&offset=1'));
    expect(res.body.usuarios).toHaveLength(1);
    expect(res.body.usuarios[0].id).toBe(donorId);
  });

  test('limit fuera de rango → 400', async () => {
    const res = await asAdmin(request(ctx.app).get('/api/users?limit=1000'));
    expect(res.status).toBe(400);
  });
});

describe('GET /api/users/:id', () => {
  test('devuelve el usuario sin hash de contraseña', async () => {
    const res = await asAdmin(request(ctx.app).get(`/api/users/${donorId}`));
    expect(res.status).toBe(200);
    expect(res.body.usuario).not.toHaveProperty('password_hash');
  });

  test('id inexistente → 404', async () => {
    const res = await asAdmin(request(ctx.app).get('/api/users/999'));
    expect(res.status).toBe(404);
  });

  test('id no numérico → 400', async () => {
    const res = await asAdmin(request(ctx.app).get('/api/users/abc'));
    expect(res.status).toBe(400);
  });
});

describe('PATCH /api/users/:id/rol', () => {
  test('el admin puede promover a un donante', async () => {
    const res = await asAdmin(request(ctx.app).patch(`/api/users/${donorId}/rol`)).send({ rol: 'admin' });
    expect(res.status).toBe(200);
    expect(res.body.usuario.rol).toBe('admin');
  });

  test('rol inválido → 400', async () => {
    const res = await asAdmin(request(ctx.app).patch(`/api/users/${donorId}/rol`)).send({ rol: 'root' });
    expect(res.status).toBe(400);
  });

  test('el admin no puede cambiar su propio rol', async () => {
    const res = await asAdmin(request(ctx.app).patch(`/api/users/${adminId}/rol`)).send({ rol: 'usuario' });
    expect(res.status).toBe(400);
  });

  test('usuario inexistente → 404', async () => {
    const res = await asAdmin(request(ctx.app).patch('/api/users/999/rol')).send({ rol: 'admin' });
    expect(res.status).toBe(404);
  });
});

describe('PATCH /api/users/:id/estado', () => {
  test('desactivar una cuenta impide su inicio de sesión', async () => {
    const res = await asAdmin(request(ctx.app).patch(`/api/users/${donorId}/estado`)).send({ activo: false });
    expect(res.status).toBe(200);
    expect(res.body.usuario.activo).toBe(false);

    const login = await request(ctx.app)
      .post('/api/auth/login')
      .send({ email: 'donante@ejemplo.com', password: 'Donante2026' });
    expect(login.status).toBe(403);
  });

  test('el admin no puede desactivarse a sí mismo', async () => {
    const res = await asAdmin(request(ctx.app).patch(`/api/users/${adminId}/estado`)).send({ activo: false });
    expect(res.status).toBe(400);
  });

  test('usuario inexistente → 404', async () => {
    const res = await asAdmin(request(ctx.app).patch('/api/users/999/estado')).send({ activo: true });
    expect(res.status).toBe(404);
  });
});
