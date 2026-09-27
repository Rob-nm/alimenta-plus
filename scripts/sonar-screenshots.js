#!/usr/bin/env node
'use strict';
/** Capturas del tablero de SonarQube como evidencia. Uso: node sonar-screenshots.js <host> <user> <pass> <projectKey> <out> */
const { chromium } = require('playwright');

const [host, user, pass, key, out] = process.argv.slice(2);

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await context.request.post(`${host}/api/authentication/login`, { form: { login: user, password: pass } });
  const page = await context.newPage();
  const pages = {
    'sonar-dashboard.png': `/dashboard?id=${key}`,
    'sonar-issues.png': `/project/issues?id=${key}&resolved=false`,
    'sonar-measures.png': `/component_measures?id=${key}`,
  };
  for (const [file, url] of Object.entries(pages)) {
    await page.goto(host + url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${out}/${file}`, fullPage: true });
    console.log(`Captura: ${file}`);
  }
  await browser.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
