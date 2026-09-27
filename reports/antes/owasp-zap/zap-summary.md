## Escaneo de seguridad — OWASP ZAP (API scan)

Versión de ZAP: 2.17.0 · Fecha: Sun, 27 Sept 2026 22:07:11

| Riesgo | Tipos de alerta |
|---|---|
| Alto | 0 |
| Medio | 0 |
| Bajo | 3 |
| Informativo | 4 |

| Riesgo | Alerta | CWE | Instancias | Solución sugerida |
|---|---|---|---|---|
| Bajo | A Server Error response code was returned by the server (100000) | 388 | 1 |  |
| Bajo | Server Leaks Information via "X-Powered-By" HTTP Response Header Field(s) (10037) | 497 | 5 | Ensure that your web server, application server, load balancer, etc. is configured to suppress "X-Powered-By" headers. |
| Bajo | X-Content-Type-Options Header Missing (10021) | 693 | 5 | Ensure that the application/web server sets the Content-Type header appropriately, and that it sets the X-Content-Type-Options header to 'nosniff' for all web p |
| Informativo | A Client Error response code was returned by the server (100000) | 388 | 32 |  |
| Informativo | Authentication Request Identified (10111) | -1 | 1 | This is an informational alert rather than a vulnerability and so there is nothing to fix. |
| Informativo | Non-Storable Content (10049) | 524 | 5 | The content may be marked as storable by ensuring that the following conditions are satisfied: The request method must be understood by the cache and defined as |
| Informativo | Storable but Non-Cacheable Content (10049) | 524 | 1 |  |
