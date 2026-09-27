CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  nombre        VARCHAR(120) NOT NULL,
  email         VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(100) NOT NULL,
  rol           VARCHAR(20)  NOT NULL DEFAULT 'usuario',
  tipo_donante  VARCHAR(30)  NOT NULL,
  organizacion  VARCHAR(160),
  telefono      VARCHAR(20),
  ciudad        VARCHAR(80),
  activo        BOOLEAN      NOT NULL DEFAULT TRUE,
  creado_en     TIMESTAMP    NOT NULL DEFAULT NOW()
);
