'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { AppError } = require('../errors');

const ROLES = Object.freeze({ ADMIN: 'admin', USUARIO: 'usuario' });
const ISSUER = 'alimenta-plus';
const AUDIENCE = 'alimenta-plus-api';

function createAuthService({ userRepository, config }) {
  // Hash ficticio para comparar cuando el correo no existe: así el tiempo de
  // respuesta es similar y no se puede adivinar qué correos están registrados.
  const dummyHash = bcrypt.hashSync('usuario-inexistente', config.bcryptRounds);

  function signToken(user) {
    return jwt.sign({ sub: String(user.id), email: user.email, rol: user.rol }, config.jwtSecret, {
      algorithm: 'HS256',
      expiresIn: config.jwtExpiresIn,
      issuer: ISSUER,
      audience: AUDIENCE,
    });
  }

  function verifyToken(token) {
    return jwt.verify(token, config.jwtSecret, {
      algorithms: ['HS256'],
      issuer: ISSUER,
      audience: AUDIENCE,
    });
  }

  async function register(data, { rol = ROLES.USUARIO } = {}) {
    const email = data.email.toLowerCase();
    const existing = await userRepository.findByEmailWithHash(email);
    if (existing) {
      throw new AppError(409, 'Ya existe una cuenta con ese correo');
    }
    const passwordHash = await bcrypt.hash(data.password, config.bcryptRounds);
    return userRepository.create({ ...data, email, passwordHash, rol });
  }

  async function login(email, password) {
    const user = await userRepository.findByEmailWithHash(email.toLowerCase());
    const valid = await bcrypt.compare(password, user ? user.password_hash : dummyHash);
    if (!user || !valid) {
      throw new AppError(401, 'Credenciales inválidas');
    }
    if (!user.activo) {
      throw new AppError(403, 'La cuenta está desactivada');
    }
    const usuario = { ...user };
    delete usuario.password_hash;
    return { token: signToken(user), usuario };
  }

  /** Crea el administrador inicial si se configuró y aún no existe. */
  async function ensureAdmin({ email, password, nombre = 'Administrador' }) {
    if (!email || !password) return null;
    const existing = await userRepository.findByEmailWithHash(email.toLowerCase());
    if (existing) return null;
    return register(
      { nombre, email, password, tipo_donante: 'particular' },
      { rol: ROLES.ADMIN },
    );
  }

  return { register, login, signToken, verifyToken, ensureAdmin };
}

module.exports = { createAuthService, ROLES };
