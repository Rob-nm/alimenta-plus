#!/usr/bin/env node
'use strict';
/**
 * Descarga las métricas de SonarQube de un proyecto y genera:
 *   <out>/sonar-measures.json, sonar-quality-gate.json, sonar-issues.json,
 *   sonar-hotspots.json y sonar-report.md (resumen legible).
 * Uso: node scripts/sonar-report.js <host> <usuario:clave> <projectKey> <out>
 */
const fs = require('node:fs');
const path = require('node:path');

const [host, credentials, projectKey, outDir] = process.argv.slice(2);
const auth = 'Basic ' + Buffer.from(credentials).toString('base64');

const METRICS = {
  ncloc: 'Líneas de código',
  coverage: 'Cobertura (%)',
  duplicated_lines_density: 'Líneas duplicadas (%)',
  bugs: 'Bugs',
  vulnerabilities: 'Vulnerabilidades',
  security_hotspots: 'Security hotspots',
  code_smells: 'Code smells',
  sqale_index: 'Deuda técnica (min)',
  sqale_debt_ratio: 'Ratio de deuda técnica (%)',
  sqale_rating: 'Calificación de mantenibilidad',
  reliability_rating: 'Calificación de confiabilidad',
  security_rating: 'Calificación de seguridad',
  security_review_rating: 'Calificación de revisión de seguridad',
  complexity: 'Complejidad ciclomática',
  cognitive_complexity: 'Complejidad cognitiva',
  software_quality_maintainability_issues: 'Issues de mantenibilidad (MQR)',
  software_quality_reliability_issues: 'Issues de confiabilidad (MQR)',
  software_quality_security_issues: 'Issues de seguridad (MQR)',
};
const RATING = { '1.0': 'A', '2.0': 'B', '3.0': 'C', '4.0': 'D', '5.0': 'E' };

async function get(apiPath) {
  const res = await fetch(host + apiPath, { headers: { Authorization: auth } });
  if (!res.ok) throw new Error(`${apiPath} → HTTP ${res.status}`);
  return res.json();
}

function fmt(key, value) {
  if (value === undefined) return 'n/d';
  if (key.endsWith('_rating')) return RATING[value] ?? value;
  if (key === 'sqale_index') {
    const min = Number(value);
    return min >= 60 ? `${min} min (${(min / 60).toFixed(1)} h)` : `${min} min`;
  }
  return value;
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const available = new Set();
  for (let p = 1; p < 10; p += 1) {
    const page = await get(`/api/metrics/search?ps=500&p=${p}`);
    page.metrics.forEach((m) => available.add(m.key));
    if (page.metrics.length < 500) break;
  }
  const keys = Object.keys(METRICS).filter((k) => available.has(k));

  const measures = await get(`/api/measures/component?component=${projectKey}&metricKeys=${keys.join(',')}`);
  const gate = await get(`/api/qualitygates/project_status?projectKey=${projectKey}`);
  const issues = await get(`/api/issues/search?componentKeys=${projectKey}&resolved=false&ps=500`);
  const hotspots = await get(`/api/hotspots/search?projectKey=${projectKey}&ps=500`).catch(() => ({ hotspots: [] }));

  const write = (name, data) => fs.writeFileSync(path.join(outDir, name), JSON.stringify(data, null, 2));
  write('sonar-measures.json', measures);
  write('sonar-quality-gate.json', gate);
  write('sonar-issues.json', issues);
  write('sonar-hotspots.json', hotspots);

  const values = Object.fromEntries(measures.component.measures.map((m) => [m.metric, m.value]));
  const lines = [];
  lines.push('## Análisis de calidad — SonarQube', '');
  lines.push(`**Quality Gate:** ${gate.projectStatus.status === 'OK' ? '✅ Aprobado (OK)' : `❌ ${gate.projectStatus.status}`}`, '');
  lines.push('| Métrica | Valor |', '|---|---|');
  keys.forEach((k) => lines.push(`| ${METRICS[k]} | ${fmt(k, values[k])} |`));
  lines.push('', `### Issues abiertos (${issues.total})`, '');
  if (issues.issues.length) {
    lines.push('| Severidad | Tipo | Regla | Archivo:línea | Mensaje |', '|---|---|---|---|---|');
    issues.issues.forEach((i) => {
      const file = i.component.split(':').slice(1).join(':');
      const sev = i.severity ?? (i.impacts || []).map((x) => x.severity).join('/');
      lines.push(`| ${sev} | ${i.type ?? ''} | ${i.rule} | ${file}:${i.line ?? '-'} | ${i.message.replace(/\|/g, '\\|')} |`);
    });
  } else {
    lines.push('Sin issues abiertos.');
  }
  lines.push('', `### Security hotspots (${hotspots.hotspots.length})`, '');
  hotspots.hotspots.forEach((h) => {
    const file = h.component.split(':').slice(1).join(':');
    lines.push(`- **${h.vulnerabilityProbability}** · ${file}:${h.line ?? '-'} — ${h.message} (${h.status})`);
  });
  const md = lines.join('\n') + '\n';
  fs.writeFileSync(path.join(outDir, 'sonar-report.md'), md);
  process.stdout.write(md);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
