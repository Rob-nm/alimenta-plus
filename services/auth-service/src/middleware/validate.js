'use strict';

const { AppError } = require('../errors');

/**
 * Valida req[source] contra un esquema zod. El resultado limpio queda en
 * req.valid[source] (en Express 5 req.query es de solo lectura).
 */
function validate(schema, source = 'body') {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source] ?? {});
    if (!result.success) {
      const detalles = result.error.issues.map((issue) => ({
        campo: issue.path.join('.') || source,
        mensaje: issue.message,
      }));
      return next(new AppError(400, 'Datos inválidos', detalles));
    }
    req.valid = { ...req.valid, [source]: result.data };
    return next();
  };
}

module.exports = { validate };
