#!/usr/bin/env bash
# Pruebas de humo contra el entorno desplegado.
set -euo pipefail
BASE="${1:-http://localhost:3000}"
J='Content-Type: application/json'

check() { # nombre, código esperado, código obtenido
  if [ "$2" = "$3" ]; then echo "✅ $1 ($3)"; else echo "❌ $1: se esperaba $2 y se obtuvo $3"; exit 1; fi
}

code=$(curl -s -o /dev/null -w '%{http_code}' "$BASE/health"); check "GET /health" 200 "$code"

code=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$BASE/api/auth/register" -H "$J" \
  -d '{"nombre":"Supermercado Prueba","email":"smoke@alimenta.mx","password":"Smoke2026x","tipo_donante":"supermercado","ciudad":"Monterrey"}')
check "POST /api/auth/register" 201 "$code"

TOKEN=$(curl -s -X POST "$BASE/api/auth/login" -H "$J" -d '{"email":"smoke@alimenta.mx","password":"Smoke2026x"}' | jq -r .token)
[ -n "$TOKEN" ] && [ "$TOKEN" != "null" ] && echo "✅ POST /api/auth/login (token emitido)"

code=$(curl -s -o /dev/null -w '%{http_code}' "$BASE/api/auth/me" -H "Authorization: Bearer $TOKEN"); check "GET /api/auth/me" 200 "$code"
code=$(curl -s -o /dev/null -w '%{http_code}' "$BASE/api/users" -H "Authorization: Bearer $TOKEN"); check "GET /api/users como donante" 403 "$code"

ADMIN_TOKEN=$(curl -s -X POST "$BASE/api/auth/login" -H "$J" -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}" | jq -r .token)
code=$(curl -s -o /dev/null -w '%{http_code}' "$BASE/api/users" -H "Authorization: Bearer $ADMIN_TOKEN"); check "GET /api/users como admin" 200 "$code"
echo "Pruebas de humo completadas."
