'use strict';

const { AppError } = require('../errors');

/** Exige un JWT válido en la cabecera Authorization: Bearer <token>. */
function authenticate(authService) {
  return (req, _res, next) => {
    const [scheme, token] = (req.headers.authorization || '').split(' ');
    if (scheme !== 'Bearer' || !token) {
      return next(new AppError(401, 'Se requiere un token de acceso'));
    }
    try {
      req.user = authService.verifyToken(token);
      return next();
    } catch {
      return next(new AppError(401, 'Token inválido o expirado'));
    }
  };
}

/** Permite el paso solo a los roles indicados. Usar después de authenticate. */
function authorize(...roles) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new AppError(401, 'Se requiere un token de acceso'));
    }
    if (!roles.includes(req.user.rol)) {
      return next(new AppError(403, 'No tienes permisos para esta acción'));
    }
    return next();
  };
}

module.exports = { authenticate, authorize };
