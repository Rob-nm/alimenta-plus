# Reportes generados por el pipeline

Descargados de los artefactos de GitHub Actions (https://github.com/Rob-nm/alimenta-plus/actions).

| Carpeta | Corrida | Commit | Descripción |
|---|---|---|---|
| `antes/` | #2 | 0fdf2b3 | Primera corrida completa, antes de las correcciones |
| `despues/` | #3 | 4e1e642 | Después de corregir los hallazgos de OWASP ZAP y SonarQube |

Cada carpeta contiene:

- `pruebas-unitarias/coverage/` — cobertura de Jest (abrir `index.html`; resumen en `coverage-summary.json`, `lcov.info` para SonarQube)
- `pruebas-unitarias/reports/junit.xml` — resultado de cada prueba
- `sonarqube/` — métricas (`sonar-measures.json`), Quality Gate, issues, hotspots, resumen `sonar-report.md` y capturas del tablero
- `owasp-zap/` — reporte de ZAP en HTML, JSON y Markdown, resumen `zap-summary.md` y log del servicio durante el escaneo

| Métrica | Antes | Después |
|---|---|---|
| Pruebas | 75 | 85 |
| Cobertura (sentencias) | 99.48 % | 99.53 % |
| Alertas ZAP (alto / medio / bajo) | 0 / 0 / 3 | 0 / 0 / 0 |
| Code smells (SonarQube) | 2 | 0 |
| Deuda técnica | 10 min | 0 min |
| Quality Gate | Aprobado | Aprobado |

`pipeline-corrida-3.png` — captura de la corrida final en GitHub Actions.
