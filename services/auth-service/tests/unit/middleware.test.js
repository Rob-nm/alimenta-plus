'use strict';

const { z } = require('zod');
const { authenticate, authorize } = require('../../src/middleware/auth');
const { validate } = require('../../src/middleware/validate');
const { notFound, errorHandler } = require('../../src/middleware/errorHandler');
const { AppError } = require('../../src/errors');

function run(middleware, req) {
  const next = jest.fn();
  middleware(req, {}, next);
  return next;
}

function mockRes() {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
}

describe('authenticate', () => {
  const authService = {
    verifyToken: jest.fn((token) => {
      if (token === 'valido') return { sub: '1', rol: 'usuario' };
      throw new Error('jwt malformed');
    }),
  };

  test.each([
    ['sin cabecera', {}],
    ['esquema distinto de Bearer', { authorization: 'Basic abc' }],
    ['Bearer sin token', { authorization: 'Bearer' }],
  ])('responde 401 %s', (_caso, headers) => {
    const next = run(authenticate(authService), { headers });
    expect(next.mock.calls[0][0]).toMatchObject({ status: 401 });
  });

  test('responde 401 con token inválido', () => {
    const next = run(authenticate(authService), { headers: { authorization: 'Bearer falso' } });
    expect(next.mock.calls[0][0]).toMatchObject({ status: 401, message: 'Token inválido o expirado' });
  });

  test('deja pasar y guarda el usuario con token válido', () => {
    const req = { headers: { authorization: 'Bearer valido' } };
    const next = run(authenticate(authService), req);
    expect(next).toHaveBeenCalledWith();
    expect(req.user).toEqual({ sub: '1', rol: 'usuario' });
  });
});

describe('authorize', () => {
  test('responde 401 si no hay usuario autenticado', () => {
    const next = run(authorize('admin'), {});
    expect(next.mock.calls[0][0]).toMatchObject({ status: 401 });
  });

  test('responde 403 si el rol no está permitido', () => {
    const next = run(authorize('admin'), { user: { rol: 'usuario' } });
    expect(next.mock.calls[0][0]).toMatchObject({ status: 403 });
  });

  test('deja pasar si el rol está permitido', () => {
    const next = run(authorize('admin', 'usuario'), { user: { rol: 'usuario' } });
    expect(next).toHaveBeenCalledWith();
  });
});

describe('validate', () => {
  const schema = z.object({ nombre: z.string().min(2) }).strict();

  test('guarda los datos validados en req.valid', () => {
    const req = { body: { nombre: 'Ana' } };
    const next = run(validate(schema), req);
    expect(next).toHaveBeenCalledWith();
    expect(req.valid.body).toEqual({ nombre: 'Ana' });
  });

  test('devuelve 400 con el detalle de cada campo', () => {
    const next = run(validate(schema), { body: { nombre: 'A' } });
    const error = next.mock.calls[0][0];
    expect(error).toMatchObject({ status: 400 });
    expect(error.details[0].campo).toBe('nombre');
  });

  test('usa el nombre de la fuente cuando el error no es de un campo concreto', () => {
    const next = run(validate(schema, 'query'), { query: { extra: 1, nombre: 'Ana' } });
    expect(next.mock.calls[0][0].details[0].campo).toBe('query');
  });

  test('trata un cuerpo ausente como objeto vacío', () => {
    const next = run(validate(schema), {});
    expect(next.mock.calls[0][0]).toMatchObject({ status: 400 });
  });
});

describe('errorHandler', () => {
  test('notFound genera un 404', () => {
    const next = run(notFound, {});
    expect(next.mock.calls[0][0]).toMatchObject({ status: 404 });
  });

  test('responde con el estado y mensaje de AppError', () => {
    const res = mockRes();
    errorHandler(new AppError(403, 'Prohibido'), {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Prohibido' });
  });

  test('incluye los detalles de validación', () => {
    const res = mockRes();
    errorHandler(new AppError(400, 'Datos inválidos', [{ campo: 'email' }]), {}, res, jest.fn());
    expect(res.json).toHaveBeenCalledWith({ error: 'Datos inválidos', detalles: [{ campo: 'email' }] });
  });

  test.each([
    [{ type: 'entity.parse.failed' }, 400],
    [{ type: 'entity.too.large' }, 413],
    [{ code: '23505' }, 409],
  ])('traduce errores conocidos (%o → %i)', (err, status) => {
    const res = mockRes();
    errorHandler(err, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(status);
  });

  test('oculta el detalle de errores inesperados', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const res = mockRes();
    errorHandler(new Error('conexión rechazada a 10.0.0.5'), {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
    spy.mockRestore();
  });
});
