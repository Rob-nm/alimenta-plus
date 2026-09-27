'use strict';

const { AppError } = require('../errors');

function notFound(_req, _res, next) {
  next(new AppError(404, 'Recurso no encontrado'));
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    const body = { error: err.message };
    if (err.details) body.detalles = err.details;
    return res.status(err.status).json(body);
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo de la petición no es JSON válido' });
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'La petición es demasiado grande' });
  }
  if (err.code === '23505') {
    return res.status(409).json({ error: 'El registro ya existe' });
  }
  // No se expone el detalle interno al cliente.
  console.error(err);
  return res.status(500).json({ error: 'Error interno del servidor' });
}

module.exports = { notFound, errorHandler };
