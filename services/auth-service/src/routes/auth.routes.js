'use strict';

const express = require('express');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { registerSchema, loginSchema } = require('../schemas/userSchemas');
const { AppError } = require('../errors');

function authRoutes({ authService, userRepository, config }) {
  const router = express.Router();

  // Registro público de donantes: el rol siempre es "usuario".
  router.post('/register', validate(registerSchema), async (req, res) => {
    const usuario = await authService.register(req.valid.body);
    res.status(201).json({ usuario });
  });

  router.post('/login', validate(loginSchema), async (req, res) => {
    const { email, password } = req.valid.body;
    const { token, usuario } = await authService.login(email, password);
    res.json({ token, tipo: 'Bearer', expiraEn: config.jwtExpiresIn, usuario });
  });

  router.get('/me', authenticate(authService), async (req, res) => {
    const usuario = await userRepository.findById(Number(req.user.sub));
    if (!usuario) throw new AppError(404, 'Usuario no encontrado');
    res.json({ usuario });
  });

  return router;
}

module.exports = { authRoutes };
