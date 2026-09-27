## Escaneo de seguridad — OWASP ZAP (API scan)

Versión de ZAP: 2.17.0 · Fecha: Sun, 27 Sept 2026 22:22:44

| Riesgo | Tipos de alerta |
|---|---|
| Alto | 0 |
| Medio | 0 |
| Bajo | 0 |
| Informativo | 3 |

| Riesgo | Alerta | CWE | Instancias | Solución sugerida |
|---|---|---|---|---|
| Informativo | A Client Error response code was returned by the server (100000) | 388 | 34 |  |
| Informativo | Authentication Request Identified (10111) | -1 | 1 | This is an informational alert rather than a vulnerability and so there is nothing to fix. |
| Informativo | Non-Storable Content (10049) | 524 | 5 | The content may be marked as storable by ensuring that the following conditions are satisfied: The request method must be understood by the cache and defined as |
