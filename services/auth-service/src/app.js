'use strict';

const path = require('node:path');
const express = require('express');
const cors = require('cors');
const { createUserRepository } = require('./repositories/userRepository');
const { createAuthService } = require('./services/authService');
const { authRoutes } = require('./routes/auth.routes');
const { userRoutes } = require('./routes/users.routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

function createApp({ db, config }) {
  const userRepository = createUserRepository(db);
  const authService = createAuthService({ userRepository, config });
  const deps = { authService, userRepository, config };

  const app = express();
  app.use(cors({ origin: config.corsOrigin }));
  app.use(express.json({ limit: '10kb' }));

  app.get('/health', (_req, res) => res.json({ estado: 'ok', servicio: 'auth-service' }));
  app.get('/api-docs/openapi.json', (_req, res) =>
    res.sendFile(path.join(__dirname, 'docs', 'openapi.json')),
  );

  app.use('/api/auth', authRoutes(deps));
  app.use('/api/users', userRoutes(deps));

  app.use(notFound);
  app.use(errorHandler);

  app.locals.authService = authService;
  return app;
}

module.exports = { createApp };
