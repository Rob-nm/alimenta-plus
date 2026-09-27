'use strict';

const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');

/** Cabeceras de seguridad para una API JSON (sin contenido HTML). */
function securityHeaders() {
  return [
    helmet({
      contentSecurityPolicy: {
        useDefaults: false,
        directives: { defaultSrc: ["'none'"], frameAncestors: ["'none'"] },
      },
      crossOriginResourcePolicy: { policy: 'same-origin' },
    }),
    (_req, res, next) => {
      // Las respuestas contienen datos personales: no se guardan en caché.
      res.set('Cache-Control', 'no-store');
      res.set('Pragma', 'no-cache');
      next();
    },
  ];
}

/** Límite de intentos para frenar ataques de fuerza bruta al login y al registro. */
function authRateLimiter(limit) {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: 'Demasiados intentos. Intenta de nuevo en unos minutos.' },
  });
}

module.exports = { securityHeaders, authRateLimiter };
