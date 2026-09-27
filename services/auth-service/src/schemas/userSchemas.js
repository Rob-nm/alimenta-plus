'use strict';

const { z } = require('zod');

// Listas blancas de caracteres: rechazan <, >, comillas y otros símbolos usados en XSS.
const NOMBRE_RE = /^[\p{L}\p{M}][\p{L}\p{M}\s.'-]*$/u;
const ORGANIZACION_RE = /^[\p{L}\p{M}\d][\p{L}\p{M}\d\s.,&'-]*$/u;
const TELEFONO_RE = /^\+?\d{10,15}$/;
// Mínimo 8 caracteres con mayúscula, minúscula y número.
const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,72}$/;

const TIPOS_DONANTE = ['restaurante', 'supermercado', 'productor', 'hotel', 'particular'];

const email = z.string().trim().max(160).email('Correo electrónico inválido');

const registerSchema = z
  .object({
    nombre: z.string().trim().min(2).max(120).regex(NOMBRE_RE, 'El nombre contiene caracteres no permitidos'),
    email,
    password: z
      .string()
      .regex(PASSWORD_RE, 'La contraseña debe tener de 8 a 72 caracteres, con mayúscula, minúscula y número'),
    tipo_donante: z.enum(TIPOS_DONANTE),
    organizacion: z
      .string()
      .trim()
      .min(2)
      .max(160)
      .regex(ORGANIZACION_RE, 'La organización contiene caracteres no permitidos')
      .optional(),
    telefono: z.string().trim().regex(TELEFONO_RE, 'Teléfono inválido (10 a 15 dígitos)').optional(),
    ciudad: z.string().trim().min(2).max(80).regex(NOMBRE_RE, 'La ciudad contiene caracteres no permitidos').optional(),
  })
  .strict();

const loginSchema = z
  .object({
    email,
    password: z.string().min(1).max(72),
  })
  .strict();

const idParamSchema = z.object({ id: z.coerce.number().int().positive() });

const listQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

const roleSchema = z.object({ rol: z.enum(['admin', 'usuario']) }).strict();
const statusSchema = z.object({ activo: z.boolean() }).strict();

module.exports = {
  registerSchema,
  loginSchema,
  idParamSchema,
  listQuerySchema,
  roleSchema,
  statusSchema,
  TIPOS_DONANTE,
};
