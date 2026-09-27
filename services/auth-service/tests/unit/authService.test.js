'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createAuthService, ROLES } = require('../../src/services/authService');
const { AppError } = require('../../src/errors');
const { TEST_CONFIG, donante } = require('../helpers/testApp');

/** Repositorio falso en memoria para probar la lógica sin base de datos. */
function fakeRepository() {
  const users = [];
  const strip = ({ password_hash: _h, ...rest }) => rest;
  return {
    users,
    async create(u) {
      const row = {
        id: users.length + 1,
        nombre: u.nombre,
        email: u.email,
        password_hash: u.passwordHash,
        rol: u.rol,
        tipo_donante: u.tipo_donante,
        activo: true,
      };
      users.push(row);
      return strip(row);
    },
    async findByEmailWithHash(email) {
      return users.find((x) => x.email === email) ?? null;
    },
  };
}

function setup() {
  const repo = fakeRepository();
  const service = createAuthService({ userRepository: repo, config: TEST_CONFIG });
  return { repo, service };
}

describe('authService.register', () => {
  test('crea al donante con rol "usuario", correo en minúsculas y contraseña hasheada', async () => {
    const { repo, service } = setup();
    const usuario = await service.register(donante({ email: 'Donante@Ejemplo.COM' }));

    expect(usuario).toMatchObject({ email: 'donante@ejemplo.com', rol: ROLES.USUARIO });
    expect(usuario).not.toHaveProperty('password_hash');
    const stored = repo.users[0];
    expect(stored.password_hash).not.toBe('Donante2026');
    expect(await bcrypt.compare('Donante2026', stored.password_hash)).toBe(true);
  });

  test('rechaza un correo ya registrado con 409', async () => {
    const { service } = setup();
    await service.register(donante());
    await expect(service.register(donante({ email: 'DONANTE@ejemplo.com' }))).rejects.toMatchObject({
      status: 409,
    });
  });

  test('permite crear un administrador solo desde el código interno', async () => {
    const { service } = setup();
    const admin = await service.register(donante(), { rol: ROLES.ADMIN });
    expect(admin.rol).toBe('admin');
  });
});

describe('authService.login', () => {
  test('devuelve un JWT válido con el rol del usuario', async () => {
    const { service } = setup();
    await service.register(donante());
    const { token, usuario } = await service.login('DONANTE@ejemplo.com', 'Donante2026');

    expect(usuario).not.toHaveProperty('password_hash');
    const payload = jwt.verify(token, TEST_CONFIG.jwtSecret, {
      issuer: 'alimenta-plus',
      audience: 'alimenta-plus-api',
    });
    expect(payload).toMatchObject({ sub: '1', rol: 'usuario', email: 'donante@ejemplo.com' });
    expect(payload.exp - payload.iat).toBe(3600);
  });

  test('rechaza contraseña incorrecta con 401', async () => {
    const { service } = setup();
    await service.register(donante());
    await expect(service.login('donante@ejemplo.com', 'Incorrecta1')).rejects.toMatchObject({
      status: 401,
      message: 'Credenciales inválidas',
    });
  });

  test('rechaza correo inexistente con el mismo mensaje genérico', async () => {
    const { service } = setup();
    const error = await service.login('nadie@ejemplo.com', 'Cualquiera1').catch((e) => e);
    expect(error).toBeInstanceOf(AppError);
    expect(error).toMatchObject({ status: 401, message: 'Credenciales inválidas' });
  });

  test('rechaza cuentas desactivadas con 403', async () => {
    const { repo, service } = setup();
    await service.register(donante());
    repo.users[0].activo = false;
    await expect(service.login('donante@ejemplo.com', 'Donante2026')).rejects.toMatchObject({
      status: 403,
    });
  });
});

describe('authService.verifyToken', () => {
  test('acepta un token emitido por el servicio', () => {
    const { service } = setup();
    const token = service.signToken({ id: 7, email: 'a@b.mx', rol: 'admin' });
    expect(service.verifyToken(token)).toMatchObject({ sub: '7', rol: 'admin' });
  });

  test('rechaza tokens firmados con otro secreto', () => {
    const { service } = setup();
    const token = jwt.sign({ sub: '1', rol: 'admin' }, 'otro-secreto', {
      issuer: 'alimenta-plus',
      audience: 'alimenta-plus-api',
    });
    expect(() => service.verifyToken(token)).toThrow();
  });

  test('rechaza tokens con otra audiencia', () => {
    const { service } = setup();
    const token = jwt.sign({ sub: '1', rol: 'admin' }, TEST_CONFIG.jwtSecret, {
      issuer: 'alimenta-plus',
      audience: 'otra-api',
    });
    expect(() => service.verifyToken(token)).toThrow();
  });
});

describe('authService.ensureAdmin', () => {
  test('no hace nada si faltan correo o contraseña', async () => {
    const { service } = setup();
    expect(await service.ensureAdmin({})).toBeNull();
    expect(await service.ensureAdmin({ email: 'a@b.mx' })).toBeNull();
  });

  test('crea el administrador una sola vez', async () => {
    const { repo, service } = setup();
    const admin = await service.ensureAdmin({
      email: 'Admin@Alimenta.mx',
      password: 'Admin2026x',
      nombre: 'Coordinación',
    });
    expect(admin).toMatchObject({ rol: 'admin', nombre: 'Coordinación', email: 'admin@alimenta.mx' });
    expect(await service.ensureAdmin({ email: 'admin@alimenta.mx', password: 'Admin2026x' })).toBeNull();
    expect(repo.users).toHaveLength(1);
  });
});
