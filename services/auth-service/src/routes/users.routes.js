'use strict';

const express = require('express');
const { validate } = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const { idParamSchema, listQuerySchema, roleSchema, statusSchema } = require('../schemas/userSchemas');
const { ROLES } = require('../services/authService');
const { AppError } = require('../errors');

/** Evita que un administrador se quite permisos o se desactive a sí mismo. */
function assertNotSelf(req) {
  if (String(req.valid.params.id) === req.user.sub) {
    throw new AppError(400, 'No puedes modificar tu propia cuenta de administrador');
  }
}

/** Gestión de usuarios: solo administradores. */
function userRoutes({ authService, userRepository }) {
  const router = express.Router();
  router.use(authenticate(authService), authorize(ROLES.ADMIN));

  router.get('/', validate(listQuerySchema, 'query'), async (req, res) => {
    const usuarios = await userRepository.list(req.valid.query);
    res.json({ usuarios, ...req.valid.query });
  });

  router.get('/:id', validate(idParamSchema, 'params'), async (req, res) => {
    const usuario = await userRepository.findById(req.valid.params.id);
    if (!usuario) throw new AppError(404, 'Usuario no encontrado');
    res.json({ usuario });
  });

  router.patch('/:id/rol', validate(idParamSchema, 'params'), validate(roleSchema), async (req, res) => {
    assertNotSelf(req);
    const usuario = await userRepository.updateRole(req.valid.params.id, req.valid.body.rol);
    if (!usuario) throw new AppError(404, 'Usuario no encontrado');
    res.json({ usuario });
  });

  router.patch('/:id/estado', validate(idParamSchema, 'params'), validate(statusSchema), async (req, res) => {
    assertNotSelf(req);
    const usuario = await userRepository.setActive(req.valid.params.id, req.valid.body.activo);
    if (!usuario) throw new AppError(404, 'Usuario no encontrado');
    res.json({ usuario });
  });

  return router;
}

module.exports = { userRoutes };
