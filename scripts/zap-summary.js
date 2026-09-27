#!/usr/bin/env node
'use strict';
/**
 * Resume el reporte JSON de OWASP ZAP en Markdown.
 * Uso: node scripts/zap-summary.js zap/zap-report.json [--fail-on-high]
 * Con --fail-on-high termina con código 1 si hay alertas de riesgo Alto.
 */
const fs = require('node:fs');

const file = process.argv[2];
const failOnHigh = process.argv.includes('--fail-on-high');
const report = JSON.parse(fs.readFileSync(file, 'utf8'));
const RISK = { 3: 'Alto', 2: 'Medio', 1: 'Bajo', 0: 'Informativo' };

const alerts = (report.site || []).flatMap((s) => s.alerts || []);
const counts = { 3: 0, 2: 0, 1: 0, 0: 0 };
alerts.forEach((a) => {
  counts[a.riskcode] += 1;
});

const out = [];
out.push('## Escaneo de seguridad — OWASP ZAP (API scan)', '');
out.push(`Versión de ZAP: ${report['@version'] || 'n/d'} · Fecha: ${report['@generated'] || 'n/d'}`, '');
out.push('| Riesgo | Tipos de alerta |', '|---|---|');
[3, 2, 1, 0].forEach((r) => out.push(`| ${RISK[r]} | ${counts[r]} |`));
out.push('');
if (alerts.length) {
  out.push('| Riesgo | Alerta | CWE | Instancias | Solución sugerida |', '|---|---|---|---|---|');
  alerts
    .sort((a, b) => Number(b.riskcode) - Number(a.riskcode))
    .forEach((a) => {
      const sol = (a.solution || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160);
      out.push(`| ${RISK[a.riskcode]} | ${a.name} (${a.pluginid}) | ${a.cweid} | ${a.count ?? (a.instances || []).length} | ${sol.replace(/\|/g, '\\|')} |`);
    });
} else {
  out.push('Sin alertas.');
}
process.stdout.write(out.join('\n') + '\n');

if (failOnHigh && counts[3] > 0) {
  console.error(`\n${counts[3]} alerta(s) de riesgo ALTO: el pipeline falla.`);
  process.exit(1);
}
