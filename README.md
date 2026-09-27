# Alimenta+ — Plataforma de donación de alimentos

Proyecto final de **Ingeniería de Software**. Este repositorio contiene el primer microservicio implementado de la arquitectura propuesta en el avance: el **servicio de Usuarios y Autenticación** (registro de personas donantes, login con JWT y roles `admin` / `usuario`), junto con su pipeline de CI/CD.

## Estructura

```
alimenta-plus/
├── .github/workflows/ci-cd.yml   Pipeline de CI/CD (GitHub Actions)
├── services/auth-service/        Microservicio Node.js + Express + PostgreSQL
│   ├── src/                      Código (rutas, middleware, servicios, repositorio)
│   ├── tests/                    Pruebas Jest (unitarias, integración, seguridad)
│   └── Dockerfile
├── scripts/                      Utilidades del pipeline (smoke tests, reportes ZAP/Sonar)
├── reports/                      Reportes generados por el pipeline (pruebas, ZAP, SonarQube)
├── docs/                         Informe final
├── docker-compose.yml            Entorno de prueba (servicio + PostgreSQL)
└── sonar-project.properties
```

## API

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/health` | Público | Estado del servicio |
| POST | `/api/auth/register` | Público | Registro de persona donante (rol `usuario`) |
| POST | `/api/auth/login` | Público | Devuelve un JWT (HS256, 1 h) |
| GET | `/api/auth/me` | Autenticado | Perfil propio |
| GET | `/api/users` | admin | Lista paginada de usuarios |
| GET | `/api/users/:id` | admin | Detalle de usuario |
| PATCH | `/api/users/:id/rol` | admin | Cambia el rol (`admin` / `usuario`) |
| PATCH | `/api/users/:id/estado` | admin | Activa o desactiva una cuenta |

La especificación OpenAPI está en `/api-docs/openapi.json`.

### Seguridad implementada
- Contraseñas con **bcrypt**; nunca se devuelven en las respuestas.
- **JWT** firmado con HS256, con `issuer`, `audience` y expiración; se rechazan `alg: none`, firmas alteradas y tokens expirados.
- **Roles**: el registro público siempre asigna `usuario`; solo un admin puede promover. Un admin no puede quitarse permisos a sí mismo.
- **Validación con listas blancas** (zod) en todas las entradas: bloquea payloads de XSS e inyección.
- **Consultas SQL parametrizadas** en todo el repositorio de datos.
- Mensaje genérico y tiempo constante en login para no revelar qué correos existen.

## Ejecutar localmente

```bash
cd services/auth-service
npm install
npm test                 # pruebas + cobertura (umbral 80 %)

# Servicio completo con PostgreSQL
cd ../..
JWT_SECRET=$(openssl rand -hex 32) ADMIN_PASSWORD=Admin2026x docker compose up --build
```

## Pipeline CI/CD

Cada push a `main` ejecuta:

1. **Lint y pruebas** — ESLint + Jest con cobertura; falla si baja del 80 %.
2. **SonarQube** — levanta SonarQube Community en el runner, analiza el código con la cobertura, exporta métricas (deuda técnica, code smells, bugs, vulnerabilidades, duplicación) y aplica el Quality Gate.
3. **Build** — construye la imagen Docker y la publica en GitHub Container Registry.
4. **Despliegue en entorno de prueba** — despliega la imagen publicada con PostgreSQL (docker compose, environment `staging`), corre pruebas de humo y un **escaneo OWASP ZAP** autenticado contra la API. Falla si hay vulnerabilidades de riesgo alto.

Todos los reportes quedan como artefactos de la ejecución y copiados en `reports/`.

## Equipo
Mauricio Nuñez Pulido · Roberto Naredo Medellín · Johan Nuñez Pulido
